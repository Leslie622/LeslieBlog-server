/* 查找改值在数据库中是否有重复 */
const checkDuplicateValue = async (model, field, value) => {
  try {
    const existingDoc = await model.findOne({ [field]: value });
    return !!existingDoc; // 返回一个布尔值表示是否存在重复值
  } catch (error) {
    // 处理错误
    throw new Error(`检查重复值时发生错误：${error.message}`);
  }
};

/* 转换查询到的菜单列表结构 */
const transformMenuList = (menuList) => {
  return menuList.map((menu) => {
    const { _id, menuType, menuName, menuCode, path, icon, parentId } = menu;
    return {
      id: _id.toString(),
      menuType,
      menuName,
      menuCode,
      path,
      icon,
      parentId,
    };
  });
};

/* 根据转换后的菜单列表生成菜单树 */
const buildMenuTree = (menuList) => {
  menuList = transformMenuList(menuList)
  const map = {};
  const tree = [];

  // 构建映射表
  menuList.forEach((menu) => {
    map[menu.id] = menu;
    menu.children = [];
  });

  menuList.forEach((menu) => {
    if (menu.parentId === null) {
      // 根节点
      tree.push(menu);
    } else {
      const parent = map[menu.parentId];
      if (parent) {
        parent.children.push(menu);
      }
    }
  });

  return tree;
};

module.exports = {
  checkDuplicateValue,
  buildMenuTree
};
