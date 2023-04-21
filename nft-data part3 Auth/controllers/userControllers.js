const express = require("express");
const fs = require("fs");

const User = require("../model/userModel");
const catchAsync = require("../Utils/catchAsync");
const AppError = require("../Utils/appError");

// FILTER OBJECT DATA
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

// UPDATE USER DATA
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1 CREATE ERROR IF USER UPDATE PASSWORD
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError("This route is not for password update", 400));
  }

  // 2 UPDATE USER DATA
  const filterBody = filterObj(req.body, "name", "email", "photo");

  const updateUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updateUser,
    },
  });
});

// DELETE USE DATA
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(200).json({
    status: "success",
    data: null,
  });
});

exports.getAllUser = catchAsync(async (req, res) => {
  const nft = await User.find();

  res.status(200).json({
    status: "success",
    data: {
      nft: nft,
    },
  });
});

exports.getSingleUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
};

exports.CreateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
};

exports.UpdateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
};

exports.DeleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
};
