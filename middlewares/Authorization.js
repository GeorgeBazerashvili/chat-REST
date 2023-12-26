const jwt = require("jsonwebtoken");

function authorize(req, res, next) {
  const token = req.headers["authorization"].split(" ")[1];

  if (!token) return res.status(400).json({ message: "token is not provided" });

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
    if (err)
      return res
        .status(401)
        .json({ message: "unauthorized user: " + err.message });

    req.user = decoded;
    next();
  });
}

module.exports = authorize;
