var express = require("express");
var router = express.Router();
const Role = require("../models/roleSchema");

/* 新增角色 */
router.post("/createRole", async function (req, res) {
  const { roleName, permissionList } = req.body;
  await Role.create({ roleName, permissionList });
  return res.send({
    status: 200,
    message: "创建成功",
  });
});

/* 删除角色 */
router.post("/deleteRole", async function (req, res) {
  const { id } = req.body;
  console.log(id)
  await Role.deleteOne({ _id:id });
  return res.send({
    status: 200,
    message: "删除成功",
  });
});

/* 查询角色列表 */
router.get("/getRoleList", async function (req, res) {
  const roleList = await Role.find();
  return res.send({
    status: 200,
    message: "查询成功",
    data: roleList,
  });
});

/* 编辑角色信息 */
router.post("/editRole", async function (req, res) {
  const { id, roleInfo } = req.body;
  console.log(id, roleInfo);
  await Role.findByIdAndUpdate(id, { $set: roleInfo });
  return res.send({
    status: 200,
    message: "编辑成功",
  });
});

module.exports = router;
