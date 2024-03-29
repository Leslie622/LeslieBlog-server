const mongoose = require("mongoose");

/* 博客分类表 */
const BlogCategorySchema = new mongoose.Schema({
  name: String, //分类名称
  introduce: String, //分类介绍
  //分类所属人
  author: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  //该分类博客数量
  count: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("BlogCategory", BlogCategorySchema);
