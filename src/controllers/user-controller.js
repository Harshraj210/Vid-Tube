import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "./utils/apiError.js";
import { user } from "./model/user.model.js";
import { uploadonCloudinary } from "./utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, username, password } = req.body;

  // for validation
  if (
    // classic JS
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new apiError(400, "All fields are required");
  }

  const existedUser = awaituser.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new apiError(400, "User allready Exist");
  }
  const avatarLocalpath = req.file?.avatar[0]?.path;
  const coverimageLocalpath = req.file?.coverimage[0]?.path;
  if (!avatarLocalpath) {
    throw new apiError(400, "Avattar file is missing");
  }
  const avatar = await uploadonCloudinary(avatarLocalpath);
});

export { registerUser };
