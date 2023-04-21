const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");
const catchAsync = require("../Utils/catchAsync");
const AppError = require("../Utils/appError");
const { connections } = require("mongoose");
const { use } = require("../routes/nftsRoute");
const sendEmail = require("../Utils/email");

// CREATE TOKEN FUNCTION
const signToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECREAT, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });

  return token;
};

// SEND TOKEN
const createSendToken = (user, statusCode, res) => {
  token = signToken(user._id);

  res.cookie("jwt", token, {
    //expires: new Date(Date.now() + process.env.JWT_COOKIE_EPXIRES * 24 * 60 * 60 * 1000),
    // secure: true,
    // httpOnly: true,
  });

  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: { user: user },
  });
};

// SIGN UP FUNCTION
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  // const newUser = await User.create({
  //   name: req.body.name,
  //   email: req.body.email,
  //   password: req.body.password,
  //   passwordConfirm: req.body.passwordConfirm,
  // });

  createSendToken(newUser, 201, res);

  // token = signToken(newUser._id);
  // res.status(200).json({
  //   status: "success",
  //   token,
  //   data: { user: newUser },
  // });
});

// LOGIN FUNCTION
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email & password"));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect Email and Password", 401));
  }

  createSendToken(user, 200, res);
  // token = signToken(user._id);
  // res.status(200).json({
  //   status: "success",
  //   token,
  // });
});

// PROTECTING DATA && CHECK USER IS LOGGEDIN OR NOT
exports.protect = catchAsync(async (req, res, next) => {
  let token;

  // 1 CHECK TOKEN
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("You are not logged in to get access", 401));
  }

  // 2 VALIDATE TOEKN
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECREAT);

  // 3 USER EXIST
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(new AppError("The user belongging to this token is no longer exist", 401));
  }

  // 4 CHANGE PASSWORD
  if (await currentUser.changePasswordAfter(decoded.iat)) {
    return next(new AppError("User recently changed the password", 401));
  }

  // USER WILL HAVE ACCESS TO PROTECTED DATA
  req.user = currentUser;

  next();
});

// CEHCK IF USER HAVE ACCESS TO DELETE NFT
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You don't have access to delete NFT", 403));
    }
    next();
  };
};

// -------------PASSWORD FIELDS---------------------

// FORGOT PASSWORD RESET
exports.forgortPassword = catchAsync(async (req, res, next) => {
  // 1 Get user based on the given email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with this email", 404));
  }

  // 2 Create a random token
  const resetToken = await user.createPasswordRestToken();
  await user.save({ validateBeforeSave: false });

  // 3 Send back email to user
  const reserURL = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forget password? submit patch request with your new password to :${reserURL}.\n If didn't forget password please ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token valid for 10 min",
      message: message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email",
    });
  } catch (error) {
    this.passwordResetToken = undefined;
    this.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError("There was an error sending the email, Try Again Later", 500));
  }
});

// RESET PASSWORD
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1 Get user based on the token
  const hashToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2 If token has not expired, and there is is user, set new password
  if (!user) {
    return next(new AppError("Token is invalid or expired", 404));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3 Update changedPassword for the user

  // 4 Log the user in ,send Jwt token

  createSendToken(user, 200, res);
  // token = signToken(user._id);
  // res.status(200).json({
  //   status: "success",
  //   token,
  // });
});

// UPDATE PASSWORD
exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1 Get user from collectoin of data
  const user = await User.findById(req.user.id).select("+password");

  // 2 Check if user posted current password correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is wrong", 404));
  }

  // 3 Is so update the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // Log user after password changed
  createSendToken(user, 200, res);
});
