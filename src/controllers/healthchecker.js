import { apiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const healthcheck = asyncHandler(async (req, res) => {
  return res
  .statuscode(200)
  .json(new apiResponse(200,"OKAY","Health check passed",));

});
export{healthcheck}