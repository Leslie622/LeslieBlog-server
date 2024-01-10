const mongoose = require("mongoose");

/* 用户表 */
const RoleSchema = new mongoose.Schema({
  roleName: String, //角色名
  permissionList: Array, //权限列表
});

module.exports = mongoose.model("Role", RoleSchema);
