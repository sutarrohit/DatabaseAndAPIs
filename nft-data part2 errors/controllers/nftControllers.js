const express = require("express");
const NFT = require("../model/nftModel");
const APIFeatures = require("../Utils/apiFeatures");
const catchAsync = require("../Utils/catchAsync");
const AppError = require("../Utils/appError");

exports.aliasTopNFTs = async (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = " -ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,difficulty";
  next();
};

// -------------------GET REQUEST----------------------

// Get All NFTS
exports.getAllNFTS = async (req, res) => {
  try {
    const features = new APIFeatures(NFT.find(), req.query).filter().sort().limitFields().pagination();
    const nft = await features.query;

    res.status(200).json({
      status: "success",
      data: {
        nft: nft,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error,
    });
  }
};

// Get single nft
exports.getSingleNFT = async (req, res) => {
  try {
    const nft = await NFT.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: { nft },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};

// -------------------POST REQUEST----------------------

// Create NFT & Add data to Database
exports.createNFT = catchAsync(async (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      nft: newNFT,
    },
  });

  // try {
  //   const newNFT = await NFT.create(req.body);
  //   res.status(200).json({
  //     status: "success",
  //     data: {
  //       nft: newNFT,
  //     },
  //   });
  // } catch (error) {
  //   res.status(400).json({
  //     status: "fail",
  //     message: error,
  //   });
  // }
});

// -------------------PATCH or UPDATE REQUEST----------------------

// Update data
exports.updateData = async (req, res) => {
  try {
    const nft = await NFT.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    res.status(200).json({
      status: "success",
      data: {
        nft: nft,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

// -------------------DELETE DATA REQUEST----------------------

// Delete data
exports.deleteData = async (req, res) => {
  try {
    await NFT.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

// ----------------Aggregator Pipelines-----------------------

exports.getNFTsStats = async (req, res) => {
  try {
    const stats = await NFT.aggregate([
      { $match: { ratingsAverage: { $gte: 4.5 } } },
      {
        $group: {
          //_id: null,
          _id: "$difficulty",
          num: { $sum: 1 },
          numRating: { $sum: "$ratingsQuantity" },
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
    ]);

    res.status(201).json({
      status: "success",
      data: stats,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

// Calcucating number of NFTs crated in month or monthly plan

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const plan = await NFT.aggregate([
      {
        $unwind: "$startDates",
      },

      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },

      {
        $group: {
          _id: null,
          // _id: { $month: "$startDates" },
          numNFTStarts: { $sum: 1 },
          nfts: { $push: "$name" },
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      data: plan,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};
