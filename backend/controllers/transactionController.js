import Transaction from "../models/Transaction.js";

export const getTransactions = async (req, res) => {
  const data = await Transaction.find({ userId: req.user.id });
  res.json(data);
};

export const addTransaction = async (req, res) => {
  const transaction = await Transaction.create({
    ...req.body,
    userId: req.user.id
  });
  res.json(transaction);
};

export const updateTransaction = async (req, res) => {
  const updated = await Transaction.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
};

export const deleteTransaction = async (req, res) => {
  await Transaction.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted successfully" });
};