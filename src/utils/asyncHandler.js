const asyncHandler = (requestHandler) => {
  // next -->middleware
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => {
      next(err);
    });
  };
};
export {asyncHandler}

// to wrap all async functions so we need not write try catch in every controller

// all errors are automatically passed to express middleware