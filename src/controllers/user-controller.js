import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";

import { User } from "../models/user.models.js";
import {
  uploadonCloudinary,
  deletefromCloudinary,
} from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";

const generateAccessandRefreshtoken = async (userId) => {
  try {
    const user = await findById(userId);
    // for user existence
    if (!user) {
      throw new apiError(404, "User not found");
    }
    const Accesstoken = user.generateAccesstoken();
    const Refreshtoken = user.generateRefreshtoken();

    user.Refreshtoken = Refreshtoken;
    await user.save({ validateBeforeSave: false });
    return { Accesstoken, Refreshtoken };
  } catch (error) {
    throw new apiError(404, "Something went wrong while generating tokens!!!");
  }
};

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
  // const avatar = await uploadonCloudinary(avatarLocalpath);
  // let coverimage = "";
  // if (coverimageLocalpath) {
  //   coverimage = await uploadonCloudinary(coverimageLocalpath);
  // }

  let avatar;
  try {
    avatar = await uploadonCloudinary(avatarLocalpath);
    console.log("UPLOAD AVATAR SUCCESSFULLY");
  } catch (error) {
    console.log("Error in uploading the avatar", error);
    throw new apiError(500, "Failed to upload Avatar");
  }

  let coverimage;
  try {
    coverimage = await uploadonCloudinary(coverimageLocalpath);
    console.log("UPLOAD COVERIMAGE SUCCESSFULLY");
  } catch (error) {
    console.log("Error in uploading the coverimage", error);
    throw new apiError(500, "Failed to upload coverimge");
  }

  try {
    const user = await User.create({
      fullname,
      avatar: avatar.url,
      coverimage: coverimage?.url || "",
      email,
      password,
      username: username.toLowerCase(),
    });
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    if (!createdUser) {
      throw new apiError(400, "Something wrong happened");
    }
    return res
      .status(201)
      .json(new apiResponse(201, createdUser, "User register successfully"));
  } catch (error) {
    console.log("User creation failed");
    if (avatar) {
      await deletefromCloudinary(avatar.public_id);
    }
    if (coverimage) {
      await deletefromCloudinary(coverimage.public_id);
    }
    throw new apiError(500, "Something went wrong while registering the user");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  // validation
  if (!email) {
    throw new apiError(404, "Email is required");
  }
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new apiError(404, "User not found");
  }

  const isPasswordvalid = await user.isPasswordCorrect(password);
  if (!isPasswordvalid) {
    throw new apiError(404, "Invalid credentials");
  }

  const { Accesstoken, Refreshtoken } = await generateAccessandRefreshtoken(
    user._id
  );

  const Loggedinuser = await user
    .findById(user._id)
    .select("-password -Refreshtoken");

    const options ={
      httpOnly:true,
      secure:process.env.NODE_ENV==="production",
    }
    return res 
    .status(200)
    .cookie("AcesssToken :",Accesstoken,options)
    .cookie("RefreshToken :",Refreshtoken,options)
    .json(new apiResponse(200,
      {user:Loggedinuser,Accesstoken,Refreshtoken},
      "User logged in Successfully"
    ))
});
// exporting the file

export { registerUser,
        loginUser
 };
