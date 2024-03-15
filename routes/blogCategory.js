var express = require("express");
var router = express.Router();
const utils = require("../utils/index");
const BlogCategory = require("../models/blogCategorySchema");
const checkPermission = require("../middleware/permission");

/* 创建博客分类 */
router.post("/create", checkPermission("blogCategory-create"), async function (req, res) {
  const userId = req.auth.id;
  const categoryInfo = req.body;
  await BlogCategory.create({ ...categoryInfo, author: userId });
  return res.send({
    status: 200,
    message: "创建博客分类成功",
    data: {},
  });
});

/* 删除博客分类 */
router.post("/delete", checkPermission("blogCategory-delete"), async function (req, res) {
  const { id } = req.body;
  await BlogCategory.findByIdAndDelete(id);
  return res.send({
    status: 200,
    message: "删除博客分类成功",
    data: {},
  });
});

/* 编辑博客分类 */
router.post("/edit", checkPermission("blogCategory-edit"), async function (req, res) {
  const { id, ...categoryInfo } = req.body;
  await BlogCategory.findByIdAndUpdate(id, categoryInfo);
  return res.send({
    status: 200,
    message: "编辑博客分类成功",
    data: {},
  });
});

/* 查询博客分类列表 */
router.post("/list", async function (req, res) {
  const userId = req.auth.id;
  const { pageSize, pageNum } = req.body;
  utils
    .MongooseFindRules({
      schema: BlogCategory,
      fieldMatch: { author: userId },
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
          categoryList: response.map((category) => {
            return {
              id: category._id,
              name: category.name,
              introduce: category.introduce,
              count: category.count,
            };
          }),
        },
      });
    })
    .catch((error) => {
      console.error(error);
    });
});

/* 根据用户id查询博客分类列表 */
router.post("/getListByUserId", async function (req, res) {
  const { userId } = req.body;
  const categoryList = await BlogCategory.find({ author: userId });
  return res.send({
    status: 200,
    message: "查询博客分类列表成功",
    data: categoryList.map((category) => {
      return {
        id: category._id,
        name: category.name,
        introduce: category.introduce,
        count: category.count,
      };
    }),
  });
});

module.exports = router;
