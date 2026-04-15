import express from "express";
import {
  getTransactions,
  addTransaction,
  deleteTransaction
} from "../controllers/transactionController.js";
import { protect } from "../middleware/authMiddleware.js";
console.log("✅ Transaction Routes Loaded");
const router = express.Router();

router.get("/", protect, getTransactions);
router.post("/", protect, addTransaction);
router.delete("/:id", protect, deleteTransaction);

export default router;