class apiError extends Error {
  constructor(
    statuscode,
    message = "Sometg=hing went wrong",
    // array to handle multiple error
    errors = [],
    stack = ""
  ) {
    super(message);
    // calls parent (ERROR) constructor to send message
    this.statuscode = statuscode;
    // error --> noData
    this.data = null;
    this.message = message;
    this.Success = false;
    this.errors = errors;
    if (stack) {
      this.stack=stack
    }
    else{
      Error.captureStackTrace(this,this.constructor)
    }
  }
}
export {apiError}
