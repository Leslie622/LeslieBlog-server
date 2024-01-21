var express = require("express");
var router = express.Router();
const Role = require("../models/roleSchema");

/* 新增角色 */
router.post("/createRole", async function (req, res) {
  const roleInfo = req.body;
  await Role.create(roleInfo);
  return res.send({
    status: 200,
    message: "创建角色成功",
    data: {},
  });
});

/* 删除角色 */
router.post("/deleteRole", async function (req, res) {
  const { id } = req.body;
  await Role.deleteOne({ _id: id });
  return res.send({
    status: 200,
    message: "删除成功",
    data: {},
  });
});

/* 查询角色列表 */
router.get("/getRoleList", async function (req, res) {
  const roleList = await Role.find();
  return res.send({
    status: 200,
    message: "查询成功",
    data: roleList.map((item) => ({
      id: item._id,
      roleName: item.roleName,
      permissionList: item.permissionList,
      menuList: item.menuList,
      isDefault: item.isDefault,
    })),
  });
});

/* 编辑角色信息 */
router.post("/editRole", async function (req, res) {
  const { id, ...roleInfo } = req.body;
  //如果传过来的roleInfo.isDafault为true，说明要更改默认角色
  if (roleInfo.isDefault === true) {
    //重置所有该字段
    await Role.updateMany({}, { $set: { isDefault: false } });
  }
  await Role.findByIdAndUpdate(id, { $set: roleInfo });
  return res.send({
    status: 200,
    message: "编辑成功",
    data: {},
  });
});

module.exports = router;
