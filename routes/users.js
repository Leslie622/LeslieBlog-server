const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/userSchema");
const Role = require("../models/roleSchema");
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

// User.findOne({ account })
// .populate({
//   path: "roleId",
//   populate: [
//     {
//       path: "permissionList",
//       model: "Menu",
//     },
//     {
//       path: "menuList",
//       model: "Menu",
//     },
//   ],
// })
// .then((user) => {
//   console.log(user);
//   return res.send({
//     status: 200,
//     message: "注册成功",
//     data: user,
//   });
//   // 处理查询结果
// })
// .catch((err) => {
//   console.error(err);
//   // 处理错误
// });

/* 用户注册 */
router.post("/register", async function (req, res) {
  //获取用户信息
  let { account, password } = req.body;
  // 检查用户名是否重复
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
  //分配默认角色
  const defaultRole = await Role.findOne({ isDefault: true });
  //创建新用户
  await User.create({
    account,
    password,
    roleId: defaultRole._id,
  });
  // 返回数据
  return res.send({
    status: 200,
    message: "注册成功",
  });
});

/* 用户列表 */
router.get("/getUserList", async function (req, res) {
  const userList = await User.find().populate("roleId");
  return res.send({
    status: 200,
    message: "获取成功",
    data: userList,
  });
});

/* 编辑用户信息 */
router.post("/editUser", async function (req, res) {
  //目前只修改用户角色
  const { id, userInfo } = req.body;
  await User.findByIdAndUpdate(id, { $set: userInfo });
  return res.send({
    status: 200,
    message: "编辑成功",
  });
});

/* 删除用户 */
router.post("/deleteUser", async function (req, res) {
  const { id } = req.body;
  await User.findByIdAndDelete(id);
  return res.send({
    status: 200,
    message: "删除成功",
  });
});
module.exports = router;
