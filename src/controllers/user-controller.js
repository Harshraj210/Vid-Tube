import { asyncHandler } from "../utils/asyncHandler.js";
import {apiError} from "./utils/apiError.js"

const registerUser =asyncHandler(async(req,res)=>{
  const {fullname,email,username,password}=req.body

  // for validation
  if(
    // classic JS
    [fullname,email,username,password].some((field)=>field?.trim()==="")
  ){
    throw new apiError(400,"All fields are required")
  }
})

export {
  registerUser
}