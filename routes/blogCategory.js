var express = require("express");
var router = express.Router();
const BlogCategory = require("../models/blogCategorySchema");

/* 创建博客分类 */
router.post("/create", async function (req, res) {
  const categoryInfo = req.body;
  await BlogCategory.create(categoryInfo);
  return res.send({
    status: 200,
    message: "创建博客分类成功",
    data: {},
  });
});

/* 删除博客分类 */
router.post("/delete", async function (req, res) {
  const { id } = req.body;
  await BlogCategory.findByIdAndDelete(id);
  return res.send({
    status: 200,
    message: "删除博客分类成功",
    data: {},
  });
});

/* 编辑博客分类 */
router.post("/edit", async function (req, res) {
  const { id, ...categoryInfo } = req.body;
  await BlogCategory.findByIdAndUpdate(id, categoryInfo);
  return res.send({
    status: 200,
    message: "编辑博客分类成功",
    data: {},
  });
});

/* 查询博客分类列表 */
router.get("/list", async function (req, res) {
  const categoryList = await BlogCategory.find();
  return res.send({
    status: 200,
    message: "查询博客分类列表成功",
    data: categoryList.map((category) => {
      return {
        id: category._id,
        name:category.name,
        introduce: category.introduce,
        count: category.count,
      };
    }),
  });
});

module.exports = router;
