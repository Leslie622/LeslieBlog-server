const mongoose = require("mongoose");

/* 角色表 */
const RoleSchema = new mongoose.Schema({
  roleName: String, //角色名
  //权限列表
  permissionList: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Menu",
    },
  ],
  //菜单列表
  menuList: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Menu",
    },
  ],
  isDefault: Boolean, //是否为默认角色
});

module.exports = mongoose.model("Role", RoleSchema);
