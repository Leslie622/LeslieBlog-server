const express = require("express");
const router = express.Router();
const Menu = require("../models/menuSchema");
const { buildMenuTree } = require("../utils/index");

/* 创建菜单 */
router.post("/createMenu", function (req, res) {
  //获取菜单信息
  const menuInfo = req.body;
  console.log(req.body);
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

/* 删除菜单 */
router.post("/deleteMenu",async function (req,res) {
  
})

module.exports = router;
