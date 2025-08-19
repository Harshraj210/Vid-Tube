import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js"
import { apiError } from "../utils/apiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
// checking for valid access valid token

export const verifyJWT= asyncHandler(async(req,_)=>{
  // _-->unused response
  // req.header,req.headers --> case sensitive
  const token = req.cookies.Accesstoken||req.header("Authorization")?.replace("Bearer","")

  if (!token) {
    throw new apiError(404,"Unauthorized")
  }
  try {
    const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_)
    const user= await User.findById(decodedToken?._id).select("-password -Refreshtoken" )
    if (!user) {
    throw new apiError(404,"User not found!!")
  }
  req.user=user
  next()
  } catch (error) {
    throw new apiError(404,"Invalid access token!!")
  }
})