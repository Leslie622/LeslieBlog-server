/* 查找改值在数据库中是否有重复 */
const checkDuplicateValue = async (model, field, value) => {
  try {
    const existingDoc = await model.findOne({ [field]: value });
    console.log(existingDoc)
    return !!existingDoc; // 返回一个布尔值表示是否存在重复值
  } catch (error) {
    // 处理错误
    throw new Error(`检查重复值时发生错误：${error.message}`);
  }
};

module.exports = {
  checkDuplicateValue,
};
