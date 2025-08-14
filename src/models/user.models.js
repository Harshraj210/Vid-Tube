import mongoose, { Schema } from "mongoose";
import bcrypt, { compare } from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new Schema(
  {
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
      type: string,
    },
  },
  { timestamps: true }
);
if (!this.modified("password")) return next();
// before saving data to MDB first schema method checks wheather it is correct --> bcrypt hasing library  {ig DB is hacked --> hashing scrambles the paasword }
userSchema.pre("save", async function (next) {
  this.password = bcrypt.hash(this.password, 10);
  // continue savbing
  next();
});

userSchema.methods.isPasswordcorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccesstoken = function () {
  return jwt.sign(
    {
      // payload
      _id: this._id,
      email: this.email,
      fullname: this.fullname,
      username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

// if someone gets access token then without refresh token new acces token cannot be generated { thatswhy refresh token live long}

userSchema.methods.generateRfreshtoken = function () {
  return jwt.sign(
    {
      // payload
      _id: this._id
      
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};
// this creates the user model in database if it not exist which will import schema from --> fro userSchmea
export const User = mongoose.model("User", userSchema);
