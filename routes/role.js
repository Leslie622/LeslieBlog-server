var express = require("express");
var router = express.Router();
const utils = require("../utils/index");
const Role = require("../models/roleSchema");
const User = require("../models/userSchema");
const checkPermission = require("../middleware/permission");

/* 新增角色 */
router.post("/createRole", checkPermission("role-create"), async function (req, res) {
  const roleInfo = req.body;
  await Role.create(roleInfo);
  return res.send({
    status: 200,
    message: "创建角色成功",
    data: {},
  });
});

/* 删除角色 */
router.post("/deleteRole", checkPermission("role-delete"), async function (req, res) {
  const { id } = req.body;
  //不能删除默认角色
  const role = await Role.findById(id);
  if (role.isDefault) {
    return res.send({
      status: 400,
      message: "不能删除默认角色",
      data: {},
    });
  }
  await Role.deleteOne({ _id: id });
  //删除角色后，给所有持有该角色的用户更换成默认角色
  const roleDeletedUsers = await User.find({ roleId: id });
  const defaultRole = await Role.findOne({ isDefault: true });
  roleDeletedUsers.forEach(async (item) => {
    await User.findByIdAndUpdate(item._id, { $set: { roleId: defaultRole._id } });
  });
  return res.send({
    status: 200,
    message: "删除成功",
    data: {},
  });
});

/* 查询角色列表 */
router.post("/getRoleList", checkPermission("role-query"), async function (req, res) {
  const { pageSize, pageNum } = req.body;
  utils
    .MongooseFindRules({
      schema: Role,
      fieldMatch: {},
      populate: [],
      page: { pageSize, pageNum },
      searchKeyword: {},
      sortArr: [],
    })
    .then(({ total, response }) => {
      return res.send({
        status: 200,
        message: "查询成功",
        data: {
          total,
          roleList: response.map((role) => {
            return {
              id: role._id,
              roleName: role.roleName,
              permissionList: role.permissionList,
              menuList: role.menuList,
              isDefault: role.isDefault,
            };
          }),
        },
      });
    })
    .catch((error) => {
      console.error(error);
    });
});

/* 编辑角色信息 */
router.post("/editRole", checkPermission("role-edit"), async function (req, res) {
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
