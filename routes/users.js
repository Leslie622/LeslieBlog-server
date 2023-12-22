const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/userSchema");
const utils = require("../utils/index");
const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");
//设置加密强度
const salt = bcrypt.genSaltSync(10);

/* 用户登录 */
router.post("/login", async function (req, res) {
  //获取用户信息
  let userInfo = req.body;
  //查找用户
  User.findOne({ account: userInfo.account }).then((user) => {
    if (user) {
      // 找到用户，检查密码是否正确
      const isValidPwd = bcrypt.compareSync(userInfo.password, user.password);
      if (isValidPwd) {
        //密码正确，生成token
        const token = jwt.sign(userInfo, jwtConfig.SECRET_KEY, {
          expiresIn: "3h",
        });
        //返回用户信息
        return res.send({
          status: 200,
          message: "登录成功",
          data: {
            ...userInfo,
            password: null, //不返回密码
            token,
          },
        });
      } else {
        //密码错误
        return res.send({
          status: 400,
          message: "密码错误",
          data: {
            account: userInfo.account,
          },
        });
      }
    } else {
      // 用户不存在
      return res.send({
        status: 400,
        message: "该账号不存在，请检查您的账号是否输入正确",
        data: {
          account: userInfo.account,
        },
      });
    }
  });
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
