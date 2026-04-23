import { ArrowUp } from "lucide-react";

export default function Sidebar({ onLogout }) {
  return (
    <aside className="sidebar">
      <div>
        <h2 className="logo">💰 SpendWise</h2>

        <ul className="menu">
          <li><a href="#summary">Dashboard</a></li>
          <li><a href="#reports">Reports</a></li>
          <li><a href="#transactions">Transactions</a></li>
        </ul>
      </div>

      <div className="sidebar-bottom">
        <button
          className="top-btn"
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: "smooth"
            })
          }
        >
          ↑ Back to Top
        </button>

        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </aside>
  );
}