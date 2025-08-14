import mongoose, { Schema, SchemaType } from "mongoose";

import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const commentSchema = new Schema(
  {
    comment:{
      type:String,
      required:true
    },
    video:{
      type:Schema.Types.ObjectId,
      ref:"Video"
    },
      owner:{
      type:Schema.Types.ObjectId,
      ref:"User"
    }
  },
  { timestamps: true }
);
// this creates the user model in database if it not exist which will import schema from --> fro userSchmea
commentSchema.plugin(mongooseAggregatePaginate)
export const Comment = mongoose.model("Comment", commentSchema);
