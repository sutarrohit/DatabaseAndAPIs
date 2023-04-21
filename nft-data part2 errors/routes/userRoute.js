const express = require("express");

const { getAllUser, getSingleUser, CreateUser, UpdateUser, DeleteUser } = require("../controllers/userControllers");

const userRouter = express.Router();

// USER Routers
userRouter.route("/").get(getAllUser).post(CreateUser);
userRouter.route("/:id").get(getSingleUser).patch(UpdateUser).delete(DeleteUser);

module.exports = userRouter;
