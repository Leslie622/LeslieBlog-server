/* 根据parentId，以children字段生成菜单树 */
function buildMenuTree(menuArray) {
  const menuMap = {};
  const menuTree = [];

  // 建立菜单映射
  menuArray.forEach((menu) => {
    menu.children = [];
    menuMap[menu.id] = menu;
  });

  // 构建菜单树
  menuArray.forEach((menu) => {
    const parentId = menu.parentId;
    if (parentId) {
      const parentMenu = menuMap[parentId];
      if (parentMenu) {
        parentMenu.children.push(menu);
      }
    } else {
      menuTree.push(menu);
    }
  });

  return menuTree;
}

/* 转换菜单数据格式 */
function transformMenuList(menuList) {
  return menuList.map((menu) => {
    const {
      _id,
      menuType,
      menuName,
      menuCode,
      path,
      component,
      icon,
      parentId,
    } = menu;
    return {
      id: _id.toString(),
      menuType,
      menuName,
      menuCode,
      path,
      component,
      icon,
      parentId: parentId ? parentId.toString() : null,
    };
  });
}

module.exports = {
  transformMenuList,
  buildMenuTree,
};
