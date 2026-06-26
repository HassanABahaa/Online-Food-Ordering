import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connected successfully:", connection.host);
  } catch (error) {
    console.log("DB connection failed:", error.message);
    process.exit(1);
  }
};
