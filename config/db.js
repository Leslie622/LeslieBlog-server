const mongoose = require("mongoose")

//数据库地址
const dbURL = "mongodb://localhost:27017/leslie-blog";

//连接MongoDB数据库
async function main() {
  await mongoose.connect(dbURL);
}

//连接成功回调
main().then(() => {
  //...
  
})

//连接失败回调
main().catch(() => {
  //...
});
