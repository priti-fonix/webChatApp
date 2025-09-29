const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();



const URI = process.env.MONGO_URI || process.env.MONGODB_URI_local;

const connectDB = async () => {
  try {
    if (!URI) {
      throw new Error("MongoDB URI not found in .env file");
    }
    await mongoose.connect(URI);
    console.log(" MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
