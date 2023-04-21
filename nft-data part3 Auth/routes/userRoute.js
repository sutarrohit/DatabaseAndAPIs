const express = require("express");

const {
  getAllUser,
  getSingleUser,
  CreateUser,
  UpdateUser,
  DeleteUser,
  updateMe,
  deleteMe,
} = require("../controllers/userControllers");

const {
  signup,
  login,
  forgortPassword,
  resetPassword,
  updatePassword,
  protect,
} = require("../controllers/authController");

const userRouter = express.Router();

userRouter.route("/signup").post(signup);
userRouter.route("/login").post(login);

userRouter.route("/forgotPassword").post(forgortPassword);
userRouter.route("/resetPassword/:token").patch(resetPassword);
userRouter.route("/updateMyPassword").patch(protect, updatePassword);
userRouter.route("/updateMe").patch(protect, updateMe);
userRouter.route("/deleteMe").delete(protect, deleteMe);

// USER Routers
userRouter.route("/").get(getAllUser).post(CreateUser);
userRouter.route("/:id").get(getSingleUser).patch(UpdateUser).delete(DeleteUser);

module.exports = userRouter;
