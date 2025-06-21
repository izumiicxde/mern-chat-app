import mongoose from "mongoose";

let conn = undefined;
export const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  try {
    conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connection success: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.log(`MongoDB connection error: ${error}`);
  }
};
