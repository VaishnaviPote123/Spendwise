import { useState, useEffect } from "react";
import "./App.css";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const [page, setPage] = useState("login");

  // Check token on app load
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setPage("dashboard");
    } else {
      setPage("login");
    }
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    setPage("login");
  };

  return (
    <div className="app-container">
      {page === "dashboard" && (
        <Dashboard onLogout={handleLogout} />
      )}

      {page === "login" && (
        <Login setPage={setPage} />
      )}

      {page === "register" && (
        <Register setPage={setPage} />
      )}
    </div>
  );
}

export default App;