import mongoose from "mongoose";

const schema = new mongoose.Schema({
  title: String,
  amount: Number,
  type: String,
  category: String,
  userId: String,
  date: {
    type: Date,
    required: true
  }
}, { timestamps: true });

export default mongoose.model("Transaction", schema);