var express = require("express");
var router = express.Router();
const blogCategory = require("../models/blogCategorySchema");

/* 创建博客分类 */
router.post("/create", async function (req, res) {
  const categoryInfo = req.body;
  await blogCategory.create(categoryInfo);
  return res.send({
    status: 200,
    message: "创建博客分类成功",
    data: {},
  });
});

/* 删除博客分类 */
router.post("/create", async function (req, res) {
  const { id } = req.body;
  await blogCategory.findByIdAndDelete(id);
  return res.send({
    status: 200,
    message: "删除博客分类成功",
    data: {},
  });
});

/* 编辑博客分类 */
router.post("/edit", async function (req, res) {
  const { id, categoryInfo } = req.body;
  await blogCategory.findByIdAndUpdate(id, categoryInfo);
  return res.send({
    status: 200,
    message: "删除博客分类成功",
    data: {},
  });
});

/* 查询博客分类列表 */
router.get("/list", async function (req, res) {
  const categoryList = await blogCategory.find();
  return res.send({
    status: 200,
    message: "删除博客分类成功",
    data: categoryList.map((category) => {
      return {
        id: category._id,
        introduce: category.introduce,
        count: category.count,
      };
    }),
  });
});

module.exports = router;
