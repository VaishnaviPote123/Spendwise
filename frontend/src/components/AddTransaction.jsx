import { useState, useEffect } from "react";
import axios from "axios";

export default function AddTransaction({
  refresh,
  editing,
  clearEdit
}) {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: "",
    date: ""
  });

  const [customCategory, setCustomCategory] = useState("");

  const token = localStorage.getItem("token");

  // Load data into form when editing
  useEffect(() => {
    if (editing) {
      setForm({
        title: editing.title || "",
        amount: editing.amount || "",
        type: editing.type || "expense",
        category: editing.category || "",
        date: editing.date ? editing.date.substring(0, 10) : ""
      });

      setCustomCategory("");
    }
  }, [editing]);

  const handleSubmit = async () => {
    const finalCategory =
      form.category === "Other" ? customCategory : form.category;

    if (!form.title || !form.amount || !finalCategory || !form.date) {
      alert("Please fill all fields");
      return;
    }

    const transactionData = {
      ...form,
      category: finalCategory
    };

    try {
      if (editing) {
        await axios.put(
          `http://localhost:5000/api/transactions/${editing._id}`,
          transactionData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        clearEdit();
      } else {
        await axios.post(
          "http://localhost:5000/api/transactions",
          transactionData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
      }

      refresh();

      // Reset form after submit
      setForm({
        title: "",
        amount: "",
        type: "expense",
        category: "",
        date: ""
      });

      setCustomCategory("");

    } catch (err) {
      console.log("Transaction Error:", err);
      alert("Error saving transaction");
    }
  };

  return (
    <div className="card">
      <h3>{editing ? "Edit Transaction" : "Add Transaction"}</h3>

      {/* Description */}
      <input
        type="text"
        placeholder="Description"
        value={form.title}
        onChange={(e) =>
          setForm({ ...form, title: e.target.value })
        }
      />

      {/* Amount */}
      <input
        type="number"
        placeholder="Amount"
        value={form.amount}
        onChange={(e) =>
          setForm({ ...form, amount: e.target.value })
        }
      />

      {/* Date */}
      <input
        type="date"
        value={form.date}
        onChange={(e) =>
          setForm({ ...form, date: e.target.value })
        }
      />

      {/* Type */}
      <select
        value={form.type}
        onChange={(e) =>
          setForm({ ...form, type: e.target.value })
        }
      >
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>

      {/* Category */}
      <select
        value={form.category}
        onChange={(e) =>
          setForm({ ...form, category: e.target.value })
        }
      >
        <option value="">Select Category</option>

        <option value="Food">Food</option>
        <option value="Travel">Travel</option>
        <option value="Shopping">Shopping</option>
        <option value="Bills">Bills</option>
        <option value="Entertainment">Entertainment</option>

        <option value="Salary">Salary</option>
        <option value="Freelance">Freelance</option>
        <option value="Bonus">Bonus</option>

        <option value="Other">Other</option>
      </select>

      {/* Custom Category */}
      {form.category === "Other" && (
        <input
          type="text"
          placeholder="Enter custom category"
          value={customCategory}
          onChange={(e) => setCustomCategory(e.target.value)}
        />
      )}

      {/* Submit */}
      <button onClick={handleSubmit}>
        {editing ? "Update Transaction" : "Add Transaction"}
      </button>
    </div>
  );
}