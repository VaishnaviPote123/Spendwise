import Transaction from "../models/Transaction.js";

// GET USER TRANSACTIONS
export const getTransactions = async (req, res) => {
  const data = await Transaction.find({ userId: req.user.id });
  res.json(data);
};

// ADD TRANSACTION
export const addTransaction = async (req, res) => {
  const newTransaction = await Transaction.create({
    ...req.body,
    userId: req.user.id
  });

  res.json(newTransaction);
};

// DELETE
export const deleteTransaction = async (req, res) => {
  await Transaction.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};