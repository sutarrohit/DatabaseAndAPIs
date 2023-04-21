const express = require("express");
const morgan = require("morgan");
require("dotenv").config();

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

module.exports = app;
