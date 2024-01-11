const mongoose = require("mongoose");

/* 用户表 */
const UserSchema = new mongoose.Schema({
  account: String, //用户名
  password: String, //用户密码
  //用户角色
  roleId: {
    type: mongoose.Types.ObjectId,
    ref: "Role",
    default: null,
  },
});
module.exports = mongoose.model("User", UserSchema);
