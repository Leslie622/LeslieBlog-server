const express = require("express");
const router = express.Router();
const Menu = require("../models/menuSchema");
const { buildMenuTree } = require("../utils/index");

/* 创建菜单 */
router.post("/createMenu", function (req, res) {
  //获取菜单信息
  const menuInfo = req.body;
  //创建菜单,将parentId为0转换成null
  if (menuInfo.parentId === 0) {
    menuInfo.parentId = null;
  }
  Menu.create(menuInfo);
  return res.send({
    status: 200,
    message: "创建成功",
  });
});

/* 获取菜单 */
router.get("/getMenuList", async function (req, res) {
  const menuList = await Menu.find();
  const menuTree = buildMenuTree(menuList);
  return res.send({
    status: 200,
    message: "获取成功",
    data: menuTree,
  });
});

/* 编辑菜单 */
router.post("/editMenu", async function (req, res) {
  const { id, menuInfo } = req.body;
  await Menu.findByIdAndUpdate(id, { $set: menuInfo });
  return res.send({
    status: 200,
    message: "编辑成功",
  });
});

/* 删除菜单 */
router.post("/deleteMenu", async function (req, res) {
  const { id } = req.body;
  deleteMenuAndChildren(id);
  return res.send({
    status: 200,
    message: "删除成功",
  });
});

async function deleteMenuAndChildren(targetId) {
  // 删除该document
  await Menu.deleteOne({ _id: targetId });
  //查找所有子内容，递归删除
  const children = await Menu.find({ parentId: targetId });
  for (const child of children) {
    await deleteMenuAndChildren(child._id);
  }
}

module.exports = router;
