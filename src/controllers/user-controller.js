import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.models.js";
import {
  uploadonCloudinary,
  deletefromCloudinary,
} from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";

// ---------------------- Generate Tokens ----------------------
const generateAccessandRefreshtoken = async (userId) => {
  try {
    const user = await User.findById(userId); // ✅ fixed
    if (!user) throw new apiError(404, "User not found");

    const accessToken = user.generateAccesstoken();
    const refreshToken = user.generateRefreshtoken();

    user.Refreshtoken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new apiError(500, "Something went wrong while generating tokens!!!");
  }
};

// ---------------------- Register User ----------------------
const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, username, password } = req.body;

  if ([fullname, email, username, password].some((f) => f?.trim() === "")) {
    throw new apiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) throw new apiError(400, "User already exists");

  const avatarLocalpath = req.files?.avatar?.[0]?.path;
  const coverimageLocalpath = req.files?.coverimage?.[0]?.path;
  if (!avatarLocalpath) throw new apiError(400, "Avatar file is missing");

  let avatar, coverimage;

  try {
    avatar = await uploadonCloudinary(avatarLocalpath);
  } catch (error) {
    throw new apiError(500, "Failed to upload Avatar");
  }

  try {
    if (coverimageLocalpath) {
      coverimage = await uploadonCloudinary(coverimageLocalpath);
    }
  } catch (error) {
    throw new apiError(500, "Failed to upload cover image");
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
      "-password -Refreshtoken"
    );

    return res
      .status(201)
      .json(new apiResponse(201, createdUser, "User registered successfully"));
  } catch (error) {
    if (avatar) await deletefromCloudinary(avatar.public_id);
    if (coverimage) await deletefromCloudinary(coverimage.public_id);
    throw new apiError(500, "Something went wrong while registering the user");
  }
});

// ---------------------- Login User ----------------------
const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!email && !username) {
    throw new apiError(400, "Email or Username is required");
  }

  const user = await User.findOne({ $or: [{ username }, { email }] });
  if (!user) throw new apiError(404, "User not found");

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new apiError(400, "Invalid credentials");

  const { accessToken, refreshToken } = await generateAccessandRefreshtoken(
    user._id
  );

  const Loggedinuser = await User.findById(user._id).select(
    "-password -Refreshtoken"
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options) // ✅ fixed names
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponse(
        200,
        { user: Loggedinuser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

// ---------------------- Logout User ----------------------
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $set: { Refreshtoken: undefined } }, // ✅ clear refresh token
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, {}, "User logged out successfully"));
});

// ---------------------- Refresh Access Token ----------------------
const RefreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshtoken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshtoken) {
    throw new apiError(401, "Refresh token required");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshtoken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);
    if (!user) throw new apiError(404, "Invalid refresh token");

    if (incomingRefreshtoken !== user.Refreshtoken) {
      throw new apiError(401, "Refresh token expired or invalid");
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessandRefreshtoken(user._id);

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new apiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed successfully"
        )
      );
  } catch (error) {
    throw new apiError(401, "Something went wrong while refreshing token");
  }
});

const changeCurrentpassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user?._id);
  const isPasswordValid = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordValid) {
    throw new apiError(404, "Invalid Old Password");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)

    .json(new apiResponse(200, {}, "Password Changed successfully"));
});
const getCurrentuser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new apiResponse(200, req.user, "Current User Details"));
});
const updateAccountdetails = asyncHandler(async (req, res) => {
  const { email, username, fullname } = req.body;
  if (!email) {
    throw new apiError(404, "Email is required");
  }
  if (!fullname) {
    throw new apiError(404, "Fullname is required");
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullname,
        email: email,
      },
    },
    { new: true }
  ).select("-password -refreshToken");
  return res
    .status(200)
    .json(new apiResponse(200, user, "Account Details updated Successfully"));
});
const updateUseravatar = asyncHandler(async (req, res) => {
  const avatarLocalpath = req.files?.path;
  if (!avatarLocalpath) {
    throw new apiError(404, "File is required!!!");
  }
  const avatar = await uploadonCloudinary(avatarLocalpath);
  if (!avatar.url) {
    throw new apiError(404, "Something went wrong while uploading Avatar!!!");
  }
  const user=await User.findByIdAndUpdate(
  req.user?._id,
    {
      $set: {
        avatar:avatar.url
      },
    },
    { new: true }
  ).select("-password -refreshToken");
  return res
    .status(200)
    .json(new apiResponse(200, user, "Avatar updated Successfully"));
});
const updateUsercoverimage = asyncHandler(async (req, res) => {});

// ---------------------- Exports ----------------------
export { registerUser, loginUser, logoutUser, RefreshAccessToken };
