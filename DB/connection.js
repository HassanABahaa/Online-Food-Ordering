import dns from "dns";
import mongoose from "mongoose";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

export const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log("DB connected successfully:", connection.host);
  } catch (error) {
    console.log("DB connection failed:", error.name, "-", error.message);
    if (error.reason) console.log("Reason:", JSON.stringify(error.reason, null, 2));
    throw error;
  }
};
