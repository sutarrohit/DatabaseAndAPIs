const mongoose = require("mongoose");
const app = require("./app");
require("dotenv").config();

process.on("uncaughtExcetion", (err) => {
  console.log(err);
  console.log("UnhandleRejection shutting down application");
  process.exit(1);
});

const DB = process.env.DATABASE_URL.replace("<PASSWORD>", process.env.DATABASE_PASS);

mongoose
  .connect(DB, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
  })
  .then((con) => {
    console.log("Database Connecetd Successfully");
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App runnig on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UnhandleRejection shutting down application");
  server.close(() => {
    process.exit(1);
  });
});
