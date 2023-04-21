const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcyrpt = require("bcryptjs");
const { restrictTo } = require("../controllers/authController");

// name, email , photo, password , confirmpassword

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name"],
  },

  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide valid email address"],
  },

  photo: {
    type: String,
    // required: [true, "Please upload your photo"],
  },

  role: {
    type: String,
    enum: ["user", "creator", "admin", "guide"],
    default: "user",
  },

  password: {
    type: String,
    required: [true, "Enter your password"],
    minlength: 8,
    select: false,
  },

  passwordConfirm: {
    type: String,
    required: [true, "please confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "The password is not same",
    },
  },

  active: {
    type: Boolean,
    default: true,
    select: false,
  },

  passwordChengedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });

  next();
});

userSchema.pre("save", function () {
  //CHECK PASSWORD MODIFIED
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChengedAt = Date.now() - 1000;
  next();
});

userSchema.pre("save", async function (next) {
  //CHECK PASSWORD MODIFIED
  if (!this.isModified("password")) return next();

  //PASSWORD HASH
  this.password = await bcyrpt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

// COMPARE USER PASSWORD FOR LOGIN
userSchema.methods.correctPassword = async function (condidatePassword, userPassword) {
  return await bcyrpt.compare(condidatePassword, userPassword);
};

// CHECK IF USER CHANGED PASSWORD OR NOT
userSchema.methods.changePasswordAfter = async function (JWTTimeStamp) {
  if (this.passwordChengedAt) {
    const changedTimeStamp = parseInt(this.passwordChengedAt.getTime() / 1000, 10);
  }
  return false;
};

// GENRATE PASSWORD REST TOKEN
userSchema.methods.createPasswordRestToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  console.log(resetToken, this.passwordResetToken);

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
