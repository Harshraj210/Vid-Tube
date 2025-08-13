import mongoose, { Schema } from "mongoose";
const userSchema = new Schema({
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
  avatar: {
    type: String,
    required: true,
  },
  coverImage: {
    type: String,
  },
  watchHistory: [
    {
      type: Schema.Types.ObjectId,
      ref: "",
    },
  ],
  password: {
    type: string,
    required: [true, "password is required"],
  },
  refreshToken: {
    type:string
  },
},
  { timestamps : true }
);
// this creates the user model in database if it not exist which will import schema from --> fro userSchmea
export const User = mongoose.model("User", userSchema);
