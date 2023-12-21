const mongoose = require("mongoose");

//定义用户表
const UserSchema = new mongoose.Schema({
  account: String, //用户名
  password: String, //用户密码
});

module.exports = mongoose.model("User", UserSchema);
