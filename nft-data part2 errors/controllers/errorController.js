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

const error = require("mongoose/lib/error");
const AppError = require("../Utils/appError");

const handleCastError = (err) => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 404);
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
      message: "somthing went very wrong",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    error = { ...err };
    if (error.name === "CastError") error = handleCastError(error);
    sendErrorPro(error, res);
  }

  next();
};
