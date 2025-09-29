const mongoose = require("mongoose");

const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file
  
const chatSchema = new mongoose.Schema({
  author: { type: String, required: true },
  room: { type: String, required: true },
  id: { type: String, required: true }, // or Number, but String is safer for Mongo _id conflict
  time: { type: String, required: true },
  message: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Message", chatSchema);
