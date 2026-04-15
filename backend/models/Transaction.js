import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  title: String,
  amount: Number,
  type: { type: String, enum: ["income", "expense"] },
  category: String,
  userId: String, // 🔥 IMPORTANT (connect to user)
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Transaction", transactionSchema);