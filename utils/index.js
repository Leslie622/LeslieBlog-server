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

/* 菜单数组 */
// [
//   {
//     _id: new ObjectId('659babd3a72644425b969f65'),
//     menuType: 1,
//     menuName: '系统管理',
//     menuCode: '',
//     path: '/system',
//     icon: '',
//     parentId: null,
//     __v: 0
//   },
//   {
//     _id: new ObjectId('659bb24b852380640780b7ec'),
//     menuType: 2,
//     menuName: '角色管理',
//     menuCode: '',
//     path: '/system/userManage',
//     icon: '',
//     parentId: new ObjectId('659babd3a72644425b969f65'),
//     __v: 0
//   },
//   {
//     _id: new ObjectId('659bf972852380640780b814'),
//     menuType: 3,
//     menuName: '新增角色',
//     menuCode: 'user-create',
//     path: '',
//     icon: '',
//     parentId: new ObjectId('659bb24b852380640780b7ec'),
//     __v: 0
//   },
//   {
//     _id: new ObjectId('659bf999852380640780b816'),
//     menuType: 3,
//     menuName: '删除角色',
//     menuCode: 'user-delete',
//     path: '',
//     icon: '',
//     parentId: new ObjectId('659bb24b852380640780b7ec'),
//     __v: 0
//   },
//   {
//     _id: new ObjectId('659f9e8d9647d44816c4373a'),
//     menuType: 3,
//     menuName: '查看角色',
//     menuCode: 'user-query',
//     path: '',
//     icon: '',
//     parentId: new ObjectId('659bb24b852380640780b7ec'),
//     __v: 0
//   },
//   {
//     _id: new ObjectId('659f9eee9647d44816c4373d'),
//     menuType: 3,
//     menuName: '编辑角色',
//     menuCode: 'user-edit',
//     path: '',
//     icon: '',
//     parentId: new ObjectId('659bb24b852380640780b7ec'),
//     __v: 0
//   },
//   {
//     _id: new ObjectId('659bb263852380640780b7ee'),
//     menuType: 2,
//     menuName: '菜单管理',
//     menuCode: '',
//     path: '/system/menuManage',
//     icon: '',
//     parentId: new ObjectId('659babd3a72644425b969f65'),
//     __v: 0
//   },
//   {
//     _id: new ObjectId('659bf9ab852380640780b818'),
//     menuType: 3,
//     menuName: '删除菜单',
//     menuCode: 'menu-delete',
//     path: '',
//     icon: '',
//     parentId: new ObjectId('659bb263852380640780b7ee'),
//     __v: 0
//   },
//   {
//     _id: new ObjectId('659bf9b7852380640780b81a'),
//     menuType: 3,
//     menuName: '新增菜单',
//     menuCode: 'menu-create',
//     path: '',
//     icon: '',
//     parentId: new ObjectId('659bb263852380640780b7ee'),
//     __v: 0
//   },
//   {
//     _id: new ObjectId('659f9f049647d44816c43740'),
//     menuType: 3,
//     menuName: '查看菜单',
//     menuCode: 'menu-query',
//     path: '',
//     icon: '',
//     parentId: new ObjectId('659bb263852380640780b7ee'),
//     __v: 0
//   },
//   {
//     _id: new ObjectId('659f9f169647d44816c43743'),
//     menuType: 3,
//     menuName: '编辑菜单',
//     menuCode: 'menu-edit',
//     path: '',
//     icon: '',
//     parentId: new ObjectId('659bb263852380640780b7ee'),
//     __v: 0
//   },
//   {
//     _id: new ObjectId('659e38c934260a725fa112e0'),
//     menuType: 2,
//     menuName: '日记管理',
//     menuCode: '',
//     path: '/diary',
//     icon: '',
//     parentId: null,
//     __v: 0
//   },
//   {
//     _id: new ObjectId('659e391134260a725fa112ec'),
//     menuType: 3,
//     menuName: '查看',
//     menuCode: 'read-diary',
//     path: '',
//     icon: '',
//     parentId: new ObjectId('659e38c934260a725fa112e0'),
//     __v: 0
//   }
// ]

/* 生成菜单树 */
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

/* 生成用户菜单树 */
function buildUserMenuTree(menuArray) {
  const menuTree = buildMenuTree(menuArray);
  // 去除 id 和 parentId 字段
  function removeFields(menu) {
    delete menu.id;
    delete menu.parentId;
    menu.children.forEach(removeFields);
  }

  menuTree.forEach(removeFields);

  return menuTree
}

function transformMenuList(menuList) {
  return menuList.map((menu) => {
    const { _id, menuType, menuName, menuCode, path,component, icon, parentId } = menu;
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
  checkDuplicateValue,
  transformMenuList,
  buildMenuTree,
  buildUserMenuTree
};
