const mongoose = require("mongoose");

/*
 * menuType:
 * 1:菜单
 * 2:路由
 * 2:按钮
 */

/*
 * order:
 * 1:列表菜单
 * 2:路由菜单
 * 3:按钮
 */

/* 菜单表 */
const MenuSchema = new mongoose.Schema({
  menuType: Number, //类型
  menuName: String, //名称
  menuCode: String,
  path: String,
  icon: String,
  parentId: mongoose.Types.ObjectId,
});

module.exports = mongoose.model("Menu", MenuSchema);
