const txCosConfig = require("../config/tx-cos");

var COS = require("cos-nodejs-sdk-v5");
var cos = new COS({
  SecretId: txCosConfig.SECRET_ID,
  SecretKey: txCosConfig.SECRET_KEY,
});

var leslieblog_cos = {
  Bucket: txCosConfig.BUCKET,
  Region: txCosConfig.REGION,
};

/* 上传图片 */
module.exports.uploadCos = function (path, buffer) {
  return new Promise((resolve, reject) => {
    cos.putObject(
      {
        ...leslieblog_cos,
        Key: path,
        Body: buffer,
      },
      function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      }
    );
  });
};

/* 删除图片 */
module.exports.deleteObjectCos = function (path) {
  return new Promise((resolve, reject) => {
    cos.deleteObject(
      {
        ...leslieblog_cos,
        Key: path,
      },
      function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      }
    );
  });
};
