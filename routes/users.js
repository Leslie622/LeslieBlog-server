const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/userSchema");
const Role = require("../models/roleSchema");
const utils = require("../utils/index");
const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");
const { deleteObjectCos } = require("../tx-cos/index");
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
      data: {},
    });
  }
  //检查密码是否正确
  const isValidPwd = bcrypt.compareSync(password, user.password);
  if (!isValidPwd) {
    return res.send({
      status: 400,
      message: "密码错误",
      data: {},
    });
  }
  // 密码验证成功，查询用户所有信息
  const userInfo = await User.findById(user._id).populate("roleId");
  //生成token
  const token = jwt.sign({ account, password, id: userInfo._id }, jwtConfig.SECRET_KEY, {
    expiresIn: "3h",
  });
  //返回数据
  return res.send({
    status: 200,
    message: "登录成功",
    data: {
      id: userInfo._id,
      account,
      role: {
        roleId: userInfo.roleId._id,
        roleName: userInfo.roleId.roleName,
      },
      token,
      avatar: userInfo.avatar,
      introduce: userInfo.introduce,
    },
  });
});

/* 用户注册 */
router.post("/register", async function (req, res) {
  //获取用户信息
  let { account, password } = req.body;
  // 检查用户名是否重复
  const user = await User.findOne({ account });
  if (user) {
    return res.send({
      status: 400,
      message: "注册失败，该用户名已被注册",
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
    avatar: "",
    introduce: "",
  });
  // 返回数据
  return res.send({
    status: 200,
    message: "注册成功",
    data: {},
  });
});

/* 获取用户菜单及权限 */
router.get("/getPermission", async function (req, res) {
  //获取到token中保存的用户全量信息
  const { id } = req.auth;
  //根据用户id查询用户信息
  const userInfo = await User.findById(id).populate({
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
  const menuTree = utils.buildMenuTree(menuList);
  return res.send({
    status: 200,
    message: "获取用户菜单权限成功",
    data: {
      permission: permissionList,
      menu: menuTree,
    },
  });
});

/* 用户列表 */
router.get("/getUserList", async function (req, res) {
  const userList = await User.find();
  console.log(userList);
  return res.send({
    status: 200,
    message: "获取成功",
    data: userList.map((item) => ({
      id: item._id,
      account: item.account,
      roleId: item.roleId,
    })),
  });
});

/* 获取当前用户信息 */
router.get("/getUserInfo", async function (req, res) {
  const { id } = req.auth;
  const userInfo = await User.findById(id).populate("roleId");
  console.log(userInfo);
  return res.send({
    status: 200,
    message: "获取成功",
    data: {
      id: userInfo._id,
      account: userInfo.account,
      role: {
        roleId: userInfo.roleId._id,
        roleName: userInfo.roleId.roleName,
      },
      avatar: userInfo.avatar,
      introduce: userInfo.introduce,
    },
  });
});

/* 编辑用户信息 */
router.post("/editUser", async function (req, res) {
  const { id, ...roleInfo } = req.body;
  //如果编辑了头像，则删除旧头像
  if (roleInfo.avatar) {
    const user = await User.findById(id);
    //获取旧头像path
    const { avatar } = user;
    //删除
    try {
      await deleteObjectCos(avatar);
    } catch (error) {}
  }
  await User.findByIdAndUpdate(id, roleInfo);
  return res.send({
    status: 200,
    message: "编辑成功",
    data: {},
  });
});

/* 删除用户 */
router.post("/deleteUser", async function (req, res) {
  const { id } = req.body;
  await User.findByIdAndDelete(id);
  return res.send({
    status: 200,
    message: "删除成功",
    data: {},
  });
});

module.exports = router;
