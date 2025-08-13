import mongoose, { Schema } from "mongoose";
const userSchema = {
  // MDB automatically adds _id field in database -->no need of adding that
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  fullname: {
    type: String,
    required: true,

    trim: true,
    index: true,
  },
  avatar:{
    type:String,
    required:true
  },
  coverImage:{
    type:String,
    
  }
};
// this creates the user model in database if it not exist which will import schema from --> fro userSchmea
export const User = mongoose.model("User", userSchema);
