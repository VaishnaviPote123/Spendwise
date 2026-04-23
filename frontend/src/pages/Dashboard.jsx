import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import AddTransaction from "../components/AddTransaction";
import Sidebar from "../components/Sidebar";

export default function Dashboard({ onLogout }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");

  const token = localStorage.getItem("token");

  // FETCH TRANSACTIONS
  const fetchData = useCallback(() => {
    setLoading(true);

    axios
      .get("http://localhost:5000/api/transactions", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        setData(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.log("Fetch Error:", err);
        setData([]);
      })
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const safeData = Array.isArray(data) ? data : [];

  // FILTER DATA BY MONTH + YEAR
  const filteredData = safeData.filter((t) => {
    const transactionDate = new Date(t.createdAt);
    const transactionMonth = transactionDate.getMonth() + 1;
    const transactionYear = transactionDate.getFullYear();

    const monthMatch =
      selectedMonth === "all" || transactionMonth === Number(selectedMonth);

    const yearMatch =
      selectedYear === "all" || transactionYear === Number(selectedYear);

    return monthMatch && yearMatch;
  });

  // AVAILABLE YEARS FOR DROPDOWN
  const years = [
    ...new Set(
      safeData.map((t) => new Date(t.createdAt).getFullYear())
    )
  ];

  // CALCULATIONS
  const income = filteredData
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const expense = filteredData
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const savings = income - expense;

  const ratio = income ? ((expense / income) * 100).toFixed(1) : 0;

  // PIE DATA
  const pieData = [
    { name: "Income", value: income },
    { name: "Expense", value: expense }
  ];

  const COLORS = ["#10b981", "#ef4444"];

  // DELETE
  const deleteTransaction = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/transactions/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      fetchData();
    } catch (err) {
      console.log("Delete Error:", err);
    }
  };

  // LOGOUT
  const handleLogout = () => {
    onLogout();
  };

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <Sidebar onLogout={handleLogout} />

      {/* MAIN */}
      <main className="main-content">
        {/* NAVBAR */}
        <div className="navbar">
  <div>
    <h1>Finance Dashboard</h1>
    <p>Welcome to your expense tracker</p>

    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
      
      {/* MONTH FILTER */}
      <select
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
        style={{
          padding: "8px",
          borderRadius: "8px"
        }}
      >
        <option value="all">All Months</option>
        <option value="1">January</option>
        <option value="2">February</option>
        <option value="3">March</option>
        <option value="4">April</option>
        <option value="5">May</option>
        <option value="6">June</option>
        <option value="7">July</option>
        <option value="8">August</option>
        <option value="9">September</option>
        <option value="10">October</option>
        <option value="11">November</option>
        <option value="12">December</option>
      </select>

      {/* YEAR FILTER */}
      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
        style={{
          padding: "8px",
          borderRadius: "8px"
        }}
      >
        <option value="all">All Years</option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>

    </div>
  </div>
</div>

        {/* FORM */}
        <AddTransaction
          refresh={fetchData}
          editing={editing}
          clearEdit={() => setEditing(null)}
        />

        {/* SUMMARY */}
        <div className="summary-grid" id="summary">
          <div className="summary-card income-card">
            <h4>Total Income</h4>
            <p>₹{income}</p>
          </div>

          <div className="summary-card expense-card">
            <h4>Total Expense</h4>
            <p>₹{expense}</p>
          </div>

          <div className="summary-card savings-card">
            <h4>Savings</h4>
            <p>₹{savings}</p>
          </div>

          <div className="summary-card ratio-card">
            <h4>Expense Ratio</h4>
            <p>{ratio}%</p>
          </div>
        </div>

        {/* REPORTS */}
        <div className="charts-grid" id="reports">
          <div className="chart-card">
            <h3>Income vs Expense</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} dataKey="value" outerRadius={90}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>Transactions Overview</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={filteredData}>
                <XAxis dataKey="category" />
                <Tooltip />
                <Bar dataKey="amount" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TRANSACTIONS */}
        <div className="transaction-card" id="transactions">
          <h3>Recent Transactions</h3>

          {filteredData.length === 0 ? (
            <p>No transactions found</p>
          ) : (
            filteredData.map((t) => (
              <div className="transaction-item" key={t._id}>
                <div>
                  <strong>{t.title}</strong>
                  <span>{t.category}</span>
                </div>

                <div className={t.type === "income" ? "green" : "red"}>
                  ₹{t.amount}
                </div>

                <div>
                  <button onClick={() => setEditing(t)}>Edit</button>
                  <button onClick={() => deleteTransaction(t._id)}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}