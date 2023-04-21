const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmate = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

require("dotenv").config();

const AppError = require("./Utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const nftRouter = require("./routes/nftsRoute");
const userRouter = require("./routes/userRoute");

const app = express();
app.use(express.json({ limit: "1000kb" }));

// DATA SANITIZATION AGAINST NoSQL QUERY INJECTION
app.use(mongoSanitize());

// DATA SANITIZATION AGAINST SITE SCRIPT XSS
app.use(xss());

// PREVENT PARAMETER POLLUTION
app.use(
  hpp({
    whitelist: ["duration"],
  })
);

// ------------------GLOBAL MIDDLEWARE----------------

// SECURE HEADER
app.use(helmate());

// RATE LIMIT
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  meassage: "To many request please try again",
});

app.use("/api", limiter);

if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

// CUSTOM MIDDLE WARE
app.use((req, res, next) => {
  console.log("Hi I am middle ware");
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log("header", req.headers);
  next();
});

app.use("/api/v1/nfts", nftRouter);
app.use("/api/v1/users", userRouter);

// Wrong patht error handling
app.all("*", (req, res, next) => {
  // res.status(400).json({
  //   status: "fail",
  //   message: `Can't find${req.originalUrl} on this server`,
  // });
  // const err = new Error(`Can't find${req.originalUrl} on this server`);
  // err.status = "fail";
  // err.statusCode = 404;
  // next(err);

  next(new AppError(`Can't find${req.originalUrl} on this server`, 404));
});

// Global error handling
app.use(globalErrorHandler);
module.exports = app;
