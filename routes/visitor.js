var express = require("express");
var router = express.Router();
const moment = require("moment");
const utils = require("../utils/index");
const Visitor = require("../models/visitorSchema");
const Ip2Region = require("ip2region").default;

/* 收集游客地理位置、操作系统、浏览器、访问次数信息 */
router.post("/setInfo", async function (req, res) {
  //获取用户客户端信息
  const { system, browser } = req.body;
  //获取用户ip（配合nginx）
  let ip = req.headers["x-real-ip"];
  if (!ip) {
    ip = req.ip; //客户端ip，获取的是没有经过nginx代理后的真实请求ip
  }
  const query = new Ip2Region();
  const ipAddress = query.search(ip);
  //获取用户城市
  const { city, province, country, isp } = ipAddress;
  //如果该ip是第一次访问则创建，否则更新并且将访问次数+1
  await Visitor.findOneAndUpdate(
    { ip },
    { $inc: { visitTimes: 1 }, $set: { location: { city, province, country, isp }, system, browser, ip } },
    { upsert: true, new: true }
  );
  return res.send({
    status: 200,
    message: "成功",
    data: {},
  });
});

/* 获取游客列表 */
router.post("/getVisitorList", async function (req, res) {
  const { pageSize, pageNum } = req.body;
  utils
    .MongooseFindRules({
      schema: Visitor,
      fieldMatch: {},
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
          visitorList: response.map((visitor) => {
            return {
              location: visitor.location,
              system: visitor.system,
              browser: visitor.browser,
              ip: visitor.ip,
              visitTimes: visitor.visitTimes,
              createdAt: moment(visitor.createdAt).format("YYYY-MM-DD HH:mm"),
              updatedAt: moment(visitor.updatedAt).format("YYYY-MM-DD HH:mm"),
            };
          }),
        },
      });
    })
    .catch((error) => {
      console.error(error);
    });
});

module.exports = router;
