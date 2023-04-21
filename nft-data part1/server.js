const mongoose = require("mongoose");
const app = require("./app");
require("dotenv").config();

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
app.listen(port, () => {
  console.log(`App runnig on port ${port}`);
});
