const express = require("express");
const {
  getAllNFTS,
  getSingleNFT,
  createNFT,
  updateData,
  deleteData,
  aliasTopNFTs,
  getNFTsStats,
  getMonthlyPlan,
} = require("../controllers/nftControllers");

const nftRouter = express.Router();

// NFT Router

// Top 5 NFT Route
nftRouter.route("/top-5-nfts").get(aliasTopNFTs, getAllNFTS);

// States Route
nftRouter.route("/nfts-stats").get(getNFTsStats);

// Get monthly plan
nftRouter.route("/monthly-plan/:year").get(getMonthlyPlan);

nftRouter.route("/").get(getAllNFTS).post(createNFT);
nftRouter.route("/:id").get(getSingleNFT).patch(updateData).delete(deleteData);

module.exports = nftRouter;
