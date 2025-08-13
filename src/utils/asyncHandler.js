const asyncHandler = (requestHandler) => {
  // next -->middleware
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => {
      next(err);
    });
  };
};
