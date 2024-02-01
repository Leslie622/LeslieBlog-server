const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
var { expressjwt: jwt } = require("express-jwt");
const jwtConfig = require("./config/jwt");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const menuRouter = require("./routes/menu");
const roleRouter = require("./routes/role");
const uploadsRouter = require("./routes/uploads");
const blogCategory = require("./routes/blogCategory");
const blog = require("./routes/blog");

const app = express();

//数据库
require("./db/index");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//jwt验证
app.use(
  jwt({
    secret: jwtConfig.SECRET_KEY,
    algorithms: ["HS256"],
  }).unless({ path: ["/api/users/login", "/api/users/register"] })
);

//路由
app.use("/", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/menu", menuRouter);
app.use("/api/role", roleRouter);
app.use("/api/uploads", uploadsRouter);
app.use("/api/blogCategory", blogCategory);
app.use("/api/blog", blog);

// 捕捉404
app.use(function (req, res, next) {
  next(createError(404));
});

// 全局错误处理
app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    return res.send({ status: 401, message: "无效的token" });
  }
  res.send({ status: 400, message: err.message });
});

module.exports = app;
