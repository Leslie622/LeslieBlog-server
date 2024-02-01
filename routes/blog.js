var express = require("express");
var router = express.Router();
const Blog = require("../models/blogSchema");

/* 创建博客 */
router.post("/create", async function (req, res) {
  const blogInfo = req.body;
  await Blog.create(blogInfo);
  return res.send({
    status: 200,
    message: "创建成功",
    data: {},
  });
});

/* 编辑博客 */
router.post("/edit", async function (req, res) {
  const { id, ...blogInfo } = req.body;
  await Blog.findByIdAndUpdate(id, blogInfo);
  return res.send({
    status: 200,
    message: "编辑成功",
    data: {},
  });
});

/* 删除博客 */
router.post("/delete", async function (req, res) {
  const { id } = req.body;
  await Blog.findByIdAndDelete(id);
  return res.send({
    status: 200,
    message: "删除成功",
    data: {},
  });
});

/* 查询博客列表 */
router.post("/list", async function (req, res) {
  const blogList = await Blog.find();
  return res.send({
    status: 200,
    message: "查询成功",
    data: blogList.map((blog) => {
      return {
        id: blog._id,
        title: blog.title,
        abstract: blog.abstract,
        cover: blog.cover,
        content: blog.content,
        category: blog.category,
        author: blog.author,
        views: blog.views,
        isOriginal: blog.isOriginal,
        isSticky: blog.isSticky,
        createTime: blog.createdAt,
        updateTime: blog.updatedAt,
      };
    }),
  });
});

module.exports = router;
