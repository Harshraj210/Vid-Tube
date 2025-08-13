class apiResponse {
  // for api response
  //  success --> default message
  constructor(statuscode, data, message = "Success") {
    this.statuscode = statuscode;
    this.data = data;
    this.message = message;
    this.Success = statuscode < 400;
  }
}
export {apiResponse}