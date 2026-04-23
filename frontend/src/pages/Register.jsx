import { useState } from "react";
import axios from "axios";

export default function Register({ setPage }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const registerUser = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        form
      );

      alert("✅ Registered successfully");
      setPage("login"); // redirect to login
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>📝 Register</h2>

        <input placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input type="password" placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button onClick={registerUser}>Register</button>

        <p onClick={() => setPage("login")}>
          Already have an account? Login
        </p>
      </div>
    </div>
  );
}