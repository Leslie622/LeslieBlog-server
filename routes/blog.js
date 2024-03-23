var express = require("express");
var router = express.Router();
const utils = require("../utils");
const moment = require("moment");
const Blog = require("../models/blogSchema");
const Category = require("../models/blogCategorySchema");
const checkPermission = require("../middleware/permission");

/* 创建博客 */
router.post("/create", checkPermission("blog-create"), async function (req, res) {
  const userId = req.auth.id;
  const blogInfo = req.body;
  const blog = await Blog.create({ ...blogInfo, author: userId });
  //使该博客分类的count+1
  await Category.updateOne({ _id: blog.category }, { $inc: { count: 1 } });
  return res.send({
    status: 200,
    message: "创建成功",
    data: {},
  });
});

/* 编辑博客 */
router.post("/edit", checkPermission("blog-edit"), async function (req, res) {
  const { id, ...blogInfo } = req.body;
  //检测博客的category字段是否发生变化,若发生变化，则旧category的count字段-1，新的+1
  const oldBlog = await Blog.findById(id);
  if (oldBlog.category.toString() !== blogInfo.category) {
    await Category.updateOne({ _id: oldBlog.category }, { $inc: { count: -1 } });
    await Category.updateOne({ _id: blogInfo.category }, { $inc: { count: 1 } });
  }
  await Blog.findByIdAndUpdate(id, blogInfo);
  return res.send({
    status: 200,
    message: "编辑成功",
    data: {},
  });
});

/* 删除博客 */
router.post("/delete", checkPermission("blog-delete"), async function (req, res) {
  const { id } = req.body;
  const blog = await Blog.findByIdAndDelete(id);
  //使该博客分类的count-1
  await Category.updateOne({ _id: blog.category }, { $inc: { count: -1 } });
  return res.send({
    status: 200,
    message: "删除成功",
    data: {},
  });
});

/* 查询博客列表:中后台 */
router.post("/list", checkPermission("blog-query"), async function (req, res) {
  const { pageSize, pageNum, searchKeyword, category, sortArr } = req.body;
  const authorId = req.auth.id;
  utils
    .MongooseFindRules({
      schema: Blog,
      fieldMatch: { author: authorId, category },
      populate: ["category"],
      page: { pageSize, pageNum },
      searchKeyword: { key: "title", value: searchKeyword },
      sortArr: sortArr,
    })
    .then(({ total, response }) => {
      return res.send({
        status: 200,
        message: "查询成功",
        data: {
          total,
          blogList: response.map((blog) => {
            return {
              id: blog._id,
              title: blog.title,
              abstract: blog.abstract,
              cover: blog.cover,
              content: "",
              draft: blog.draft,
              category: blog.category.name,
              author: blog.author,
              views: blog.views,
              isOriginal: blog.isOriginal,
              isSticky: blog.isSticky,
              createdAt: moment(blog.createdAt).format("YYYY-MM-DD"),
              updatedAt: moment(blog.updatedAt).format("YYYY-MM-DD"),
            };
          }),
        },
      });
    })
    .catch((error) => {
      console.error(error);
    });
});

/* 查询博客列表:前台 */
router.post("/getListByUserId", async function (req, res) {
  const { pageSize, pageNum, searchKeyword, category, sortArr } = req.body;
  const authorId = req.body.userId;
  utils
    .MongooseFindRules({
      schema: Blog,
      fieldMatch: { author: authorId, category },
      populate: ["category"],
      page: { pageSize, pageNum },
      searchKeyword: { key: "title", value: searchKeyword },
      sortArr: sortArr,
    })
    .then(({ total, response }) => {
      return res.send({
        status: 200,
        message: "查询成功",
        data: {
          total,
          blogList: response.map((blog) => {
            return {
              id: blog._id,
              title: blog.title,
              abstract: blog.abstract,
              cover: blog.cover,
              content: "",
              draft: blog.draft,
              category: blog.category.name,
              author: blog.author,
              views: blog.views,
              isOriginal: blog.isOriginal,
              isSticky: blog.isSticky,
              createdAt: moment(blog.createdAt).format("YYYY-MM-DD"),
              updatedAt: moment(blog.updatedAt).format("YYYY-MM-DD"),
            };
          }),
        },
      });
    })
    .catch((error) => {
      console.error(error);
    });
});

/* 查询单篇博客 */
router.post("/singleBlog", async function (req, res) {
  const { blogId } = req.body;
  //博客浏览量+1
  const blog = await Blog.findByIdAndUpdate(blogId, { $inc: { views: 1 } }, { new: true, timestamps: false });
  return res.send({
    status: 200,
    message: "查询成功",
    data: {
      id: blog._id,
      title: blog.title,
      abstract: blog.abstract,
      cover: blog.cover,
      content: blog.content,
      draft: blog.draft,
      category: blog.category,
      author: blog.author,
      views: blog.views,
      isOriginal: blog.isOriginal,
      isSticky: blog.isSticky,
      createdAt: moment(blog.createdAt).format("YYYY-MM-DD"),
      updatedAt: moment(blog.updatedAt).format("YYYY-MM-DD"),
    },
  });
});

module.exports = router;
