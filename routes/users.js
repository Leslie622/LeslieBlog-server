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
  let { account, password } = req.body;
  //查找用户
  const user = await User.findOne({ account });
  //没要找到则返回错误信息
  if (!user) {
    return res.send({
      status: 400,
      message: "该账号不存在，请检查您的账号是否输入正确",
    });
  }
  //检查密码是否正确
  const isValidPwd = bcrypt.compareSync(password, user.password);
  if (!isValidPwd) {
    return res.send({
      status: 400,
      message: "密码错误",
    });
  }
  // 密码验证成功，查询用户所有信息
  const userInfo = await User.findById(user._id).populate({
    path: "roleId",
    populate: [
      {
        path: "permissionList",
        model: "Menu",
      },
      {
        path: "menuList",
        model: "Menu",
      },
    ],
  });
  // 生成权限列表
  const permissionList = [];
  userInfo.roleId.permissionList.forEach((item) => {
    permissionList.push(item.menuCode);
  });
  // 生成菜单树
  const menuList = utils.transformMenuList(userInfo.roleId.menuList);
  const menuTree = utils.buildUserMenuTree(menuList);
  //生成token
  const token = jwt.sign({ account, password }, jwtConfig.SECRET_KEY, {
    expiresIn: "3h",
  });
  //返回数据
  return res.send({
    status: 200,
    message: "登录成功",
    data: {
      account,
      role: userInfo.roleId.roleName,
      permissionList,
      menuList: menuTree,
      token,
    },
  });
});

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
