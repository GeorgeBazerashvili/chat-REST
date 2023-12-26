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

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJRCI6IjY1NzllNTE4NDFkYjI2NjJmNTZhZmM5ZiIsImlhdCI6MTcwMzQ5Njg0NSwiZXhwIjoxNzAzNDk2ODQ2fQ.KkvYPUUAM6-e2Y1EqrbnoHrai_H9yCtJNpbLh4_ZkjE

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJRCI6IjY1NzllNTE4NDFkYjI2NjJmNTZhZmM5ZiIsImlhdCI6MTcwMzQ5Njg3MiwiZXhwIjoxNzAzNDk2ODgyfQ.zbf1J6Z3OsLa4etbOqZMADQsiaTEkHT-3t2KhIs2v38

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJRCI6IjY1NzllNTE4NDFkYjI2NjJmNTZhZmM5ZiIsImlhdCI6MTcwMzQ5NjkwNywiZXhwIjoxNzAzNDk2OTE3fQ.O_AD7wx0eK89MC6gWU2jNGkee__ya-KLZuH-yyGN5SE
