import { asyncHandler } from "../utils/asyncHandler.js";
import {apiError} from "../utils/apiError.js";

import  {User}  from "../models/user.models.js";
import { uploadonCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, username, password } = req.body;

  // for validation
  if (
    // classic JS
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new apiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new apiError(400, "User allready Exist");
  }
  const avatarLocalpath = req.files?.avatar?.[0]?.path;
  const coverimageLocalpath = req.files?.coverimage?.[0]?.path;
  if (!avatarLocalpath) {
    throw new apiError(400, "Avatar file is missing");
  }
  const avatar = await uploadonCloudinary(avatarLocalpath);
  let coverimage = "";
  if (coverimageLocalpath) {
    coverimage = await uploadonCloudinary(coverimageLocalpath);
  }
  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverimage: coverimage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  const createdUser = await User
    .findById(user._id)
    .select("-password -refreshToken");
  if (!createdUser) {
    throw new apiError(400, "Something wrong happened");
  }
  return res
    .status(201)
    .json(new apiResponse(201, createdUser, "User register successfully"));
});

export { registerUser };
