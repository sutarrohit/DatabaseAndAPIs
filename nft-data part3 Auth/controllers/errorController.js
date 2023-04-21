// module.exports = (err, req, res, next) => {
//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || "error";

//   if (process.env.NODE_ENV === "development") {
//     res.status(err.statusCode).json({
//       status: err.status,
//       message: err.message,
//       error: err,
//       stack: err.stack,
//     });
//   } else if (process.env.NODE_ENV === "development") {
//     res.status(err.statusCode).json({
//       status: err.status,
//       message: err.message,
//     });
//   }

//   next();
// };

// -------------------------------------PART 2------------------------------------------

const AppError = require("../Utils/appError");

const handleCastError = (err) => {
  let message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 404);
};

const handleJwtError = (err) => {
  new AppError("Invalid Token, Please login", 401);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorPro = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "something went very wrong",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    if (error.name === "CastError") error = handleCastError(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError") error = handleValidationError(error);
    if (error.name === "JsonWebTokenError") error = handleJwtError(error);
    sendErrorPro(error, res);
  }

  next();
};
