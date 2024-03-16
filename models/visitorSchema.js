const mongoose = require("mongoose");

/* 游客信息表 */
const visitorSchema = new mongoose.Schema(
  {
    location: {
      country: String,
      province: String,
      city: String,
      isp: String,
    }, //地址
    system: String, //操作系统
    browser: String, //浏览器
    ip: String, //ip
    visitTimes: {
      type: Number,
      default: 0,
    }, //访问次数
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("visitor", visitorSchema);
