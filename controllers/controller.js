const Users = require("../models/Users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require("fs");
const { jwtDecode } = require("jwt-decode");
const path = require("path");

async function register_post(req, res) {
  try {
    const { username, email, password } = req.body;

    const user = await Users.create({
      username,
      email,
      password,
    });

    const accessToken = jwt.sign({ ID: user._id }, process.env.ACCESS_TOKEN, {
      expiresIn: "1h",
    });

    const refreshToken = jwt.sign({ ID: user._id }, process.env.REFRESH_TOKEN, {
      expiresIn: "30d",
    });

    res
      .status(200)
      .json({ message: "works I guess", accessToken, refreshToken });
  } catch (err) {
    // console.error(err);
    res
      .status(400)
      .json({ err: err.message, message: "I guess it doesn't work" });
  }
}

async function login_post(req, res) {
  try {
    const { email, password } = req.body;

    const user = await Users.findOne({ email });

    if (!user)
      return res.status(400).json({ err: "Email or password is incorrect" });

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword)
      return res.status(400).json({ err: "Email or password is incorrect" });

    const accessToken = jwt.sign({ ID: user._id }, process.env.ACCESS_TOKEN, {
      expiresIn: "1h",
    });

    const refreshToken = jwt.sign({ ID: user._id }, process.env.REFRESH_TOKEN, {
      expiresIn: "1M",
    });

    res
      .status(200)
      .json({ message: "Login successful.", accessToken, refreshToken });
  } catch (err) {
    // console.error(err.message);
    res.status(400).json({ err });
  }
}

async function refreshAccessToken(req, res) {
  try {
    const { refreshToken, accessToken } = req.body;

    // console.log({ refreshToken, accessToken });

    if (!refreshToken)
      return res.status(401).json({ message: "User is unauthorized" });
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, decoded) => {
      if (err || decoded.exp <= Date.now() / 1000)
        return res.status(401).json({
          message: "unauthorized please log in again",
          navigate: "please navigate to the login page and authenticate again",
        });

      req.user = decoded;
    });

    if (!accessToken)
      return res.status(401).json({ message: "User is unauthorized" });

    const date = jwtDecode(accessToken);
    // console.log(date);

    if (date.exp <= Date.now() / 1000) {
      const newAccessToken = jwt.sign(
        { ID: jwtDecode(refreshToken).ID },
        process.env.ACCESS_TOKEN,
        {
          expiresIn: "1h",
        }
      );

      res.status(200).json({
        message: "successfully refreshed access token",
        newAccessToken,
      });
    } else {
      res.status(200).json({ message: "epee joo daa..." });
    }
  } catch (error) {
    // console.error(error.message);
    res.status(400).json({
      message: `oops there occured an error: ${error}`,
      error,
    });
  }
}

async function upload(req, res) {
  try {
    res
      .status(200)
      .json({ message: "file uploaded...", filePath: req.filePath });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function removeFile(req, res) {
  try {
    const { fileName } = req.body;

    const filePath = path.join(__dirname, "../", "uploads", fileName);

    fs.unlink(filePath, (err) => {
      if (err) throw err;
    });

    res.status(200).json({
      message: "successfully removed the file from the folder",
      filePath,
    });
  } catch (error) {
    res.status(400).json({ errorMessage: error.message, error });
  }
}

async function getUserInfo(req, res) {
  try {
    const userID = req.user.ID;

    const user = await Users.findOne({ _id: userID });

    const userName = user.username;

    res.status(200).json({
      message: "successfully fetched user's info.",
      username: userName,
    });
  } catch (error) {
    res
      .status(400)
      .json({ error, message: `The error occured: ${error.message}` });
  }
}

async function verifyToken(req, res) {
  try {
    res.status(200).json({ message: "successfully verified!" });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ error: error, message: error.message });
  }
}

module.exports = {
  register_post,
  login_post,
  refreshAccessToken,
  upload,
  removeFile,
  getUserInfo,
  verifyToken,
};

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJRCI6IjY1NzllNTE4NDFkYjI2NjJmNTZhZmM5ZiIsImlhdCI6MTcwMzQ5NjAwNCwiZXhwIjoxNzAzNDk2MDA1fQ.FQoRb9BMYWdiyYoeDl8bgvvKbGh9Iy1ofr6mtf5-N6c

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJRCI6IjY1NzllNTE4NDFkYjI2NjJmNTZhZmM5ZiIsImlhdCI6MTcwMzQ5NjA5MSwiZXhwIjoxNzAzNDk2MTAxfQ.jMZs1s_BEwv5N7bl-Wc4FaXsSfM9Uj202lTid1oHT-g
