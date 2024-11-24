import mongoose from "mongoose";
import dotenv from "dotenv";
//import { dbName } from "../constants.js";

dotenv.config();

const connectDb = async () => {
  try {
    const mongoURI = `${process.env.MONGODB_URI}`;

    const connectionResponse = await mongoose.connect(mongoURI);
    console.log("Connected to", connectionResponse.connection.host);
  } catch (err) {
    console.log("Error while connecting to db", err);
    process.exit(1);
  }
};

export default connectDb;
