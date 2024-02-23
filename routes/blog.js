var express = require("express");
var router = express.Router();
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

/* 查询博客列表 */
router.post("/list", checkPermission("blog-query"), async function (req, res) {
  const { pageSize, pageNum, searchKeyword, category, sortArr } = req.body;
  const authorId = req.auth.id;
  //自定义查找规则
  findByRules(authorId, pageSize, pageNum, searchKeyword, category, sortArr)
    .then(({ totalCount, blogList }) => {
      return res.send({
        status: 200,
        message: "查询成功",
        data: {
          total: totalCount,
          blogList: blogList.map((blog) => {
            return {
              id: blog._id,
              title: blog.title,
              abstract: blog.abstract,
              cover: blog.cover,
              content: blog.content,
              draft: blog.draft,
              category: blog.category.name,
              author: blog.author,
              views: blog.views,
              isOriginal: blog.isOriginal,
              isSticky: blog.isSticky,
              createdAt: moment(blog.createdAt).format("YYYY-MM-DD HH:mm"),
              updatedAt: moment(blog.updatedAt).format("YYYY-MM-DD HH:mm"),
            };
          }),
        },
      });
    })
    .catch((error) => {
      console.error(error);
    });
});

/* 根据用户id查询博客列表 */
router.post("/getListByUserId", async function (req, res) {
  const { pageSize, pageNum, searchKeyword, category, sortArr } = req.body;
  const  authorId  = req.body.userId;
  //自定义查找规则
  findByRules(authorId, pageSize, pageNum, searchKeyword, category, sortArr)
    .then(({ totalCount, blogList }) => {
      return res.send({
        status: 200,
        message: "查询成功",
        data: {
          total: totalCount,
          blogList: blogList.map((blog) => {
            return {
              id: blog._id,
              title: blog.title,
              abstract: blog.abstract,
              cover: blog.cover,
              content: blog.content,
              draft: blog.draft,
              category: blog.category.name,
              author: blog.author,
              views: blog.views,
              isOriginal: blog.isOriginal,
              isSticky: blog.isSticky,
              createdAt: moment(blog.createdAt).format("YYYY-MM-DD HH:mm"),
              updatedAt: moment(blog.updatedAt).format("YYYY-MM-DD HH:mm"),
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
  const blog = await Blog.findByIdAndUpdate(blogId, { $inc: { views: 1 } }, { new: true });
  //博客浏览量+1
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
      createdAt: moment(blog.createdAt).format("YYYY-MM-DD HH:mm"),
      updatedAt: moment(blog.updatedAt).format("YYYY-MM-DD HH:mm"),
    },
  });
});

/* 规则查找 */
const findByRules = async (authorId, pageSize, pageNum, searchKeyword, category, sortArr) => {
  //默认只能查找该作者自己的博客，并关联category字段
  let query = Blog.find({ author: authorId }).populate("category");
  //按照分类查找
  if (category && category !== "") {
    query = query.where("category").equals(category);
  }
  // //模糊搜索
  if (searchKeyword && searchKeyword !== "") {
    console.log(searchKeyword);
    query = query.where("title").regex(new RegExp(searchKeyword, "i"));
  }
  //获取文章总数
  const countQuery = query.clone(); // 克隆查询对象，用于获取总数量
  const totalCount = await countQuery.countDocuments(); // 获取符合条件的文档总数
  //按照字段排序查找
  if (sortArr && sortArr.length > 0) {
    const sortCriteria = {};
    for (const sortObj of sortArr) {
      sortCriteria[sortObj.field] = sortObj.order === -1 ? -1 : 1;
    }
    query = query.sort(sortCriteria);
  }
  //分页
  if (pageSize && pageNum) {
    const skipAmount = pageSize * (pageNum - 1);
    query = query.skip(skipAmount).limit(pageSize);
  }
  //执行查找
  try {
    const blogList = await query;
    return { totalCount, blogList };
  } catch (error) {
    console.error("Error retrieving blog list:", error);
    throw error;
  }
};

module.exports = router;
