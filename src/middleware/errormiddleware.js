import mongoose from "mongoose";

import { apiError } from "./utils/apiError.js";

const errorHandler = (err, req, res, next) => {
  let error = error;
  if (!(error instanceof apiError)) {
    const statuscode = error.statuscode || error instanceof mongoose.Error;
  }
};

export { errorHandler };
