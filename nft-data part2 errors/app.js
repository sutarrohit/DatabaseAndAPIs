const express = require("express");
const morgan = require("morgan");
require("dotenv").config();

const AppError = require("./Utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const nftRouter = require("./routes/nftsRoute");
const userRouter = require("./routes/userRoute");

const app = express();
app.use(express.json());

if (process.env.NODE_ENV == "development") {
  console.log("This is morgon", process.env.NODE_ENV);
  app.use(morgan("dev"));
}

// CUSTOM MIDDLE WARE
app.use((req, res, next) => {
  console.log("Hi I am middle ware");
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
