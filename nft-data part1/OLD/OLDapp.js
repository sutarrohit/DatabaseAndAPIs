// const express = require("express");
// const morgan = require("morgan");
// const fs = require("fs");

// const app = express();
// const port = 3000;

// app.use(express.json());
// app.use(morgan("dev"));

// // CUSTOM MIDDLE WARE

// app.use((req, res, next) => {
//   console.log("Hi I am middle ware");
//   next();
// });

// const nfts = JSON.parse(fs.readFileSync(`${__dirname}/data/nft-simple.json`));

// // -------------------[NFT SECTION]--------------------------

// // -------------------GET REQUEST----------------------

// // Get All NFTS
// const getAllNFTS = (req, res) => {
//   res.json({
//     status: "success",
//     result: nfts.length,
//     data: {
//       nfts,
//     },
//   });
// };

// // Get single nft
// const getSingleNFT = (req, res) => {
//   const id = req.params.id * 1;
//   const nft = nfts.find((el) => el.id === id);

//   if (!nft) {
//     return res.status(404).json({
//       status: "failed",
//       message: "Invalid Id",
//     });
//   }
//   res.status(200).json({
//     status: "success",
//     data: { nft },
//   });
// };

// // -------------------POST REQUEST----------------------

// // Create NFT & Add data to Database
// const createNFT = (req, res) => {
//   const nftId = nfts[nfts.length - 1].id + 1;

//   const newNFT = Object.assign({ id: nftId }, req.body);
//   nfts.push(newNFT);

//   // Writting data to the nfts file
//   fs.writeFile(`${__dirname}/data/nft-simple.json`, JSON.stringify(nfts), (error) => {
//     res.status(201).json({ status: "success", nft: newNFT });
//   });
// };

// // -------------------PATCH or UPDATE REQUEST----------------------

// // Update data
// const updateData = (req, res) => {
//   if (req.params.id >= nfts.length) {
//     return res.status(404).json({
//       status: "failed",
//       message: "Invalid Id",
//     });
//   }

//   res.status(200).json({
//     status: "success",
//     data: {
//       nft: "updating nft",
//     },
//   });
// };

// // -------------------DELETE DATA REQUEST----------------------

// // Delete data
// const deleteData = (req, res) => {
//   if (req.params.id >= nfts.length) {
//     return res.status(404).json({
//       status: "failed",
//       message: "Invalid Id",
//     });
//   }

//   res.status(204).json({
//     status: "success",
//     data: null,
//   });
// };

// // -------------------[USER SECTION]--------------------------

// const getAllUser = (req, res) => {
//   res.status(500).json({
//     status: "error",
//     message: "Internal server error",
//   });
// };

// const getSingleUser = (req, res) => {
//   res.status(500).json({
//     status: "error",
//     message: "Internal server error",
//   });
// };

// const CreateUser = (req, res) => {
//   res.status(500).json({
//     status: "error",
//     message: "Internal server error",
//   });
// };

// const UpdateUser = (req, res) => {
//   res.status(500).json({
//     status: "error",
//     message: "Internal server error",
//   });
// };

// const DeleteUser = (req, res) => {
//   res.status(500).json({
//     status: "error",
//     message: "Internal server error",
//   });
// };

// // ------Routers--------

// const nftRouter = express.Router();
// const userRouter = express.Router();

// // app.get("/api/v1/nfts", getAllNFTS);
// // app.post("/api/v1/nfts/", createNFT);
// // app.get("/api/v1/nfts/:id", getSingleNFT);
// // app.patch("/api/v1/nfts/:id", updateData);
// // app.delete("/api/v1/nfts/:id", deleteData);

// // NFT Router
// nftRouter.route("/").get(getAllNFTS).post(createNFT);
// nftRouter.route("/:id").get(getSingleNFT).patch(updateData).delete(deleteData);

// // USER Routers
// userRouter.route("/").get(getAllUser).post(CreateUser);
// userRouter.route("/:id").get(getSingleUser).patch(UpdateUser).delete(DeleteUser);

// app.use("/api/v1/nfts", nftRouter);
// app.use("/api/v1/users", userRouter);

// app.listen(port, () => {
//   console.log(`App runnig on port ${port}`);
// });
