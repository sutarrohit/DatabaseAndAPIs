const express = require("express");
const NFT = require("../model/nftModel");

// -------------------GET REQUEST----------------------

exports.alisaTopNFTs = async (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = " -ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,difficulty";
  next();
};

// Get All NFTS
exports.getAllNFTS = async (req, res) => {
  try {
    // Fliter query data
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    //Advance Flitering query data
    let querystr = JSON.stringify(queryObj);
    querystr = querystr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = NFT.find(JSON.parse(querystr));

    // Shorting data
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // Fileds Limiting
    if (req.query.fields) {
      const field = req.query.fields.split(",").join(" ");
      query = query.select(field);
    } else {
      query = query.select("-__v");
    }

    // Pagiantion Fuctions
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const newNFT = await NFT.countDocuments();
      console.log("newNFT", newNFT, skip);
      if (skip > newNFT) {
        console.log("error");
        throw new Error("This page dosen't exits");
      }
    }

    const nft = await query;

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
    console.log(nft);

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
exports.createNFT = async (req, res) => {
  try {
    const newNFT = await NFT.create(req.body);

    res.status(200).json({
      status: "success",
      data: {
        nft: newNFT,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

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
