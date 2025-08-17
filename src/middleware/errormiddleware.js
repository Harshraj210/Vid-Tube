import mongoose from "mongoose";
//  for better error handling

import { apiError } from "../utils/apiError.js";

const errorHandler = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof apiError)) {
    const statuscode =
      error.statusode || error instanceof mongoose.Error ? 400 : 500;

    const errormessage = error.message || "Something went wrong!!";
    error = new apiError(
      statuscode,
      errormessage,
      error?.errors || [],
      err.stack
    );
  }

  const response = {
    error,
    message: error.message,
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
  };
  return res.status(error.statusCode).json(response);
};
// for other files to use

export { errorHandler };
