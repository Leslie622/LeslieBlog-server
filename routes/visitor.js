var express = require("express");
var router = express.Router();
const moment = require("moment");
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
  const { city, province, country } = ipAddress;
  //如果该ip是第一次访问则创建，否则更新并且将访问次数+1
  await Visitor.findOneAndUpdate(
    { ip },
    { $inc: { visitTimes: 1 }, $set: { location: country + " " + province + " " + city, system, browser, ip } },
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
  findByRules(pageSize, pageNum)
    .then(({ total, visitorList }) => {
      return res.send({
        status: 200,
        message: "查询成功",
        data: {
          total,
          visitorList: visitorList.map((visitor) => {
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

/* 查找规则 */
const findByRules = async (pageSize, pageNum) => {
  let query = Visitor.find();
  //获取游客总数
  const countQuery = query.clone(); // 克隆查询对象，用于获取总数量
  const total = await countQuery.countDocuments(); // 获取符合条件的文档总数
  //分页
  if (pageSize && pageNum) {
    const skipAmount = pageSize * (pageNum - 1);
    query = query.skip(skipAmount).limit(pageSize);
  }
  //执行查找
  try {
    const visitorList = await query;
    return { total, visitorList };
  } catch (error) {
    throw error;
  }
};

module.exports = router;
