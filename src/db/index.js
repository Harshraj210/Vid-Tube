// for Database connections

import mongoose, { connect } from "mongoose";
import { DB_NAME } from "../constants.js";

const DBconnect = async () => {
  try {
    const connectionsInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}`
    );
    console.log(
      `\n MONGODB connected DBHOST : ${connectionsInstance.connection.host}`
    );
  } catch (error) {
    console.log("Problem in connecting in Database!!", error);
    process.exit(1);
  }
};
export default DBconnect