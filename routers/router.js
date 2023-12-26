const express = require("express");
const Router = express.Router();
const uploadMiddleware = require("../middlewares/upload.js");
const Authorization = require("../middlewares/Authorization.js");
const {
  register_post,
  login_post,
  refreshAccessToken,
  upload,
  removeFile,
  getUserInfo,
  verifyToken,
} = require("../controllers/controller.js");

Router.post("/auth/register", register_post);
Router.post("/auth/login", login_post);
Router.post("/refresh", refreshAccessToken);
Router.post("/upload", uploadMiddleware.single("file"), upload);
Router.post("/removefile", Authorization, removeFile);

Router.get("/username", Authorization, getUserInfo);
Router.get("/verify", Authorization, verifyToken);

module.exports = Router;
