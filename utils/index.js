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
    const { _id, menuType, menuName, menuCode, path, component, icon, parentId } = menu;
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

/**
 * Mongoose 根据指定规则查询数据
 * @param {Model} schema - Mongoose 模型
 * @param {Object} fieldMatch - 字段匹配规则
 * @param {Array} populate - 需要 populate 的子文档字段数组
 * @param {Object} page - 分页参数对象
 *   @typedef {Object} page
 *   @property {number} pageSize - 每页个数
 *   @property {number} pageNum - 页码
 * @param {Object} searchKeyword - 模糊搜索关键字对象
 *   @typedef {Object} SearchKeyword
 *   @property {string} key - 要搜索的字段名
 *   @property {string} value - 搜索关键字
 * @param {Array} sortArr - 排序规则数组
 *   @typedef {Object} SortObject
 *   @property {string} field - 要排序的字段名
 *   @property {number} order - 排序方式，-1 为降序，1 为升序
 * @returns {Promise<Object>} 包含符合查询条件的结果和总数的 Promise 对象
 */
const MongooseFindRules = async ({ schema, fieldMatch, populate, page, searchKeyword, sortArr }) => {
  let query;
  //字段匹配:如果某字段没有值则不需要匹配
  if (fieldMatch) {
    for (const field in fieldMatch) {
      if (fieldMatch.hasOwnProperty(field) && fieldMatch[field] == "") {
        delete fieldMatch[field];
      }
    }
    query = schema.find(fieldMatch);
  }
  //子文档
  if (populate) {
    populate.forEach((item) => {
      query = query.populate(item);
    });
  }
  //模糊搜索
  if (searchKeyword && searchKeyword.key && searchKeyword.value !== "") {
    const { key, value } = searchKeyword;
    query = query.where(key).regex(new RegExp(value, "i"));
  }
  //获取列表总数
  const countQuery = query.clone(); // 克隆查询对象，用于获取总数量
  const total = await countQuery.countDocuments(); // 获取符合条件的文档总数
  //按照字段排序查找
  if (sortArr && sortArr.length > 0) {
    const sortCriteria = {};
    for (const sortObj of sortArr) {
      sortCriteria[sortObj.field] = sortObj.order === -1 ? -1 : 1;
    }
    query = query.sort(sortCriteria);
  }
  //分页
  if (page) {
    const { pageSize, pageNum } = page;
    if (pageSize && pageNum) {
      const skipAmount = pageSize * (pageNum - 1);
      query = query.skip(skipAmount).limit(pageSize);
    }
  }
  //执行查找
  try {
    const response = await query;
    return { total, response };
  } catch (error) {
    console.error("Error retrieving blog list:", error);
    throw error;
  }
};

module.exports = {
  transformMenuList,
  buildMenuTree,
  MongooseFindRules,
};
