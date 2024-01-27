var express = require("express");
var router = express.Router();
const path = require("path");
const multer = require("multer");
const { uploadCos } = require("../tx-cos/index");

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

router.post("/uploadSingleImage", upload.single("image"), async function (req, res, next) {
  //使用的是multer的memoryStorage，可以直接拿到buffer
  const { originalname, buffer, fieldname } = req.file;
  const fullPath = fieldname + "/" + Date.now() + path.extname(originalname);
  //上传到tx-cos
  await uploadCos(fullPath, buffer);
  //返回图片路径
  res.send({
    status: 200,
    message: "成功",
    data: { path: fullPath },
  });
});

module.exports = router;
