

import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = new Schema({
  videoFile:{
    type:string,
    required:true
  },
  thumbnail:{
    type:string,
    required:true
  },
  description:{
    type:string,
    required:true
  },
  views:{
    type:number,
    default:0
  },
  title:{
    type:string,
    required:true
  },
  duration:{
    type:number,
    required:true
  },
  isPublished:{
    type:number,
    default:true
  },
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
  }
},
{ timestamps:true })
// this creates the user model in database if it not exist which will import schema from --> fro userSchmea
videoSchema.plugin(mongooseAggregatePaginate)
export const Video = mongoose.model("Video", videochema);
