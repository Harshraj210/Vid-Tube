import mongoose, { Schema, SchemaType } from "mongoose";
const TweetSchema = new Schema(
  {
    content:{
      type:String,
      required:true
    },
    
      owner:{
      type:Schema.Types.ObjectId,
      ref:"User"
    }
  },
  { timestamps: true }
);
// this creates the user model in database if it not exist which will import schema from --> fro userSchmea
export const Tweet = mongoose.model("Tweet", TweetSchema);
