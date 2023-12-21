var express = require("express");
var router = express.Router();

const User = require("../models/userSchema");

/* 用户登录 */
router.post("/login", function (req, res, next) {
  console.log(res);
  res.send({
    status: 200,
    message: "登录成功",
  });
});

module.exports = router;
