const mongoose = require("mongoose");

//定义用户表
const UserSchema = new mongoose.Schema({
  userId: Number, //用户ID，自增长
  userName: String, //用户名
  userPwd: String, //用户密码，md5加密
  userEmail: String, //用户邮箱
  mobile: String, //手机号
  sex: Number, //性别 0:男  1：女
});

const User = mongoose.model("User",UserSchema)

User.create({
  userName: "lyf", //用户名
  userPwd: "123456", //用户密码，md5加密
  userEmail: "1234545", //用户邮箱
  mobile: "123123123", //手机号
  sex: 0, //性别 0:男  1：女
}).then((r) => {
  console.log(r)
});