const mongoose = require("mongoose");

/* 博客分类表 */
const BlogSchema = new mongoose.Schema(
  {
    title: String, //标题
    abstract: String, //摘要
    cover: String, //封面路径
    content: String, //内容
    //分类
    category: {
      type: mongoose.Types.ObjectId,
      ref: "BlogCategory",
    },
    //作者
    author: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    //浏览量
    views: {
      type: Number,
      default: 0,
    },
    //是否原创
    isOriginal: {
      type: Boolean,
      default: true,
    },
    //是否置顶
    isSticky: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Blog", BlogSchema);
