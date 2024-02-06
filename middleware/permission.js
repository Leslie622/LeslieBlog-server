const Role = require("../models/roleSchema");

const checkPermission = (sign) => {
  return async (req, res, next) => {
    //获取用户角色
    const { roleId } = req.auth;
    const role = await Role.findById(roleId).populate("permissionList");
    //生成权限列表
    const permissionList = [];
    role.permissionList.forEach((item) => {
      permissionList.push(item.menuCode);
    });
    //判断是否具有权限
    if (permissionList.includes(sign)) {
      next();
    } else {
      return res.send({
        status: 400,
        message: "您没有权限",
        data: {},
      });
    }
  };
};

module.exports = checkPermission;
