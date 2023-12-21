const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/userSchema");
const utils = require("../utils/index");
//设置加密强度
const salt = bcrypt.genSaltSync(10);

/* 用户登录 */
router.post("/login", function (req, res) {
  //获取用户信息
  let { account, password } = req.body;
  //生成token
  
});

/* 用户注册 */
router.post("/register", async function (req, res) {
  //获取用户信息
  let { account, password } = req.body;
  //检查用户名是否重复
  const isDuplicateAccount = await utils.checkDuplicateValue(
    User,
    "account",
    account
  );
  if (isDuplicateAccount) {
    return res.send({
      status: 400,
      message: "注册失败，该用户名已被注册",
      data: {
        account,
      },
    });
  }
  //密码加密
  password = bcrypt.hashSync(password, salt);
  //创建新用户
  User.create({
    account,
    password,
  });
  //返回数据
  return res.send({
    status: 200,
    message: "注册成功",
    data: {
      account,
    },
  });
});

module.exports = router;
