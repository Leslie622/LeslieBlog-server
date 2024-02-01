var express = require("express");
var router = express.Router();
const Blog = require("../models/blogSchema");

/* 创建博客 */
router.post("/create", async function (req, res) {
  const blogInfo = req.body;
  //  const a =  await Blog.create(blogInfo);
  await Blog.findByIdAndUpdate("65ba293410080a85a7be0d81", {});
  // console.log(a);
  return res.send({
    status: 200,
    message: "创建博客成功",
    data: {},
  });
});

module.exports = router;
