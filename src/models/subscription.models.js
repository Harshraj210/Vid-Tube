import mongoose, { Schema } from "mongoose";
const subscriptionSchema = new Schema({
  // MDB automatically adds _id field in database -->no need of adding that
  subscriber:{
    // one who is subssscribibng
    type:Schema.Types.ObjectId,
    ref:"User"

  },
  channel:{
    type:Schema.Types.ObjectId,
    ref:"User"

  }
},
  { timestamps : true }
);
// this creates the user model in database if it not exist which will import schema from --> fro userSchmea
export const Subscription = mongoose.model("Subscription", subscriptionSchema);
