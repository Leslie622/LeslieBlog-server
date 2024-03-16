var express = require("express");
var router = express.Router();
const https = require("https");
const Visitor = require("../models/visitorSchema");

const defaultMapData = [
  { name: "北京市", value: 0 },
  { name: "天津市", value: 0 },
  { name: "河北省", value: 0 },
  { name: "山西省", value: 0 },
  { name: "内蒙古", value: 0 },
  { name: "辽宁省", value: 0 },
  { name: "吉林省", value: 0 },
  { name: "黑龙江省", value: 0 },
  { name: "上海市", value: 0 },
  { name: "江苏省", value: 0 },
  { name: "浙江省", value: 0 },
  { name: "安徽省", value: 0 },
  { name: "福建省", value: 0 },
  { name: "江西省", value: 0 },
  { name: "山东省", value: 0 },
  { name: "河南省", value: 0 },
  { name: "湖北省", value: 0 },
  { name: "湖南省", value: 0 },
  { name: "广东省", value: 0 },
  { name: "广西", value: 0 },
  { name: "海南省", value: 0 },
  { name: "重庆市", value: 0 },
  { name: "四川省", value: 0 },
  { name: "贵州省", value: 0 },
  { name: "云南省", value: 0 },
  { name: "西藏", value: 0 },
  { name: "陕西省", value: 0 },
  { name: "甘肃省", value: 0 },
  { name: "青海省", value: 0 },
  { name: "宁夏", value: 0 },
  { name: "新疆", value: 0 },
  { name: "台湾省", value: 0 },
  { name: "香港", value: 0 },
  { name: "澳门", value: 0 },
];

/* 请求中国地图json */
router.get("/getCNMapJson", async function (req, res) {
  https
    .get("https://leslie-blog-1314141789.cos.ap-nanjing.myqcloud.com/json/china.json", (response) => {
      let data = "";
      response.on("data", (chunk) => {
        data += chunk;
      });
      response.on("end", () => {
        return res.send({
          status: 200,
          message: "成功",
          data: { chinaJson: data },
        });
      });
    })
    .on("error", (error) => {
      console.error("发生错误:", error);
    });
});

/* 获取所有游客地理位置数据 */
router.get("/getVisitorLocation", async function (req, res) {
  const visitorProvinceList = await Visitor.aggregate([
    {
      $group: {
        _id: "$location.province",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        name: "$_id",
        value: "$count",
      },
    },
  ]);
  const data = mergeArrays(defaultMapData, visitorProvinceList);
  return res.send({
    status: 200,
    message: "成功",
    data: data.sort((a, b) => {
      return a.value - b.value;
    }),
  });
});

/* 工具函数：将两个对象数组合并 */
function mergeArrays(arr1, arr2) {
  const merged = {};
  for (const item1 of arr1) {
    merged[item1.name] = item1.value;
  }
  for (const item2 of arr2) {
    if (item2.name !== "") {
      merged[item2.name] = item2.value;
    }
  }
  const result = Object.entries(merged).map(([name, value]) => ({ name, value }));
  return result;
}

module.exports = router;
