const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");

const nftSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Enter Name"],
      unique: true,
      trim: true,
      maxlength: [40, "nft must have less than  40 characters"],
      minlength: [10, "nft must have greater than 10 charactor"],
      // validate: [validator.isAlpha, "NFT name must only contains characters"],
    },
    slug: String,
    duration: {
      type: String,
      required: [true, "must have duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "must have a maxGroupSize"],
    },
    difficulty: {
      type: String,
      required: [true, "must have diffculty"],
      enum: {
        values: ["easy", "medium", "hard"],
        message: "Difficulty either easy, medium ,hard",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 1,
      min: [1, "must have 1 rating"],
      max: [5, "must have 5 rating "],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Enter Price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (value) {
          return value < this.price;
        },
        message: "price should be below regular price",
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "must provide the summary"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "must provide the cover image"],
    },
    images: [String],

    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],

    secretNfts: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field
nftSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

//--------MONGOOSE MIDDLEWARE

//DOCUMNT MIDDLEWARE: runs before .save() or .create()
nftSchema.pre("save", function (next) {
  // console.log("nftSchema", this);
  this.slug = slugify(this.name, { lower: true });
  next();
});

//------------------QYERY MIDDLEWARE
//---------pre
nftSchema.pre(/^find/, function (next) {
  this.find({ secretNfts: { $ne: true } });
  this.start = Date.now();
  next();
});

//-----post
nftSchema.post(/^find/, function (doc, next) {
  console.log(`Query took time: ${Date.now() - this.start} times`);
  // console.log(doc);
  next();
});

//AGGREATION MIDDLEWARE
nftSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secretNfts: { $ne: true } } });
  // console.log(this.pipeline());
  next();
});

const NFT = mongoose.model("NFT", nftSchema);

module.exports = NFT;
