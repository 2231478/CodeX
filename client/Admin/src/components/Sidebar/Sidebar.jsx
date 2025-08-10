import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBed,
  FaClipboardList,
  FaExchangeAlt,
  FaUser,
  FaDoorOpen,
  FaChartBar,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="close-btn" onClick={onClose}>
        <FaTimes />
      </div>

      <nav className="nav-links">
        <NavLink to="/dashboard" className="nav-item">
          <FaTachometerAlt />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/facilities" className="nav-item">
          <FaBed />
          <span>Facilities</span>
        </NavLink>
        <NavLink to="/reservations" className="nav-item">
          <FaClipboardList />
          <span>Reservations</span>
        </NavLink>
        <NavLink to="/transactions" className="nav-item">
          <FaExchangeAlt />
          <span>Transactions</span>
        </NavLink>
        <NavLink to="/user" className="nav-item">
          <FaUser />
          <span>User</span>
        </NavLink>
        <NavLink to="/checkin" className="nav-item">
          <FaDoorOpen />
          <span>Check-In/Out</span>
        </NavLink>
        <NavLink to="/reports" className="nav-item">
          <FaChartBar />
          <span>Reports</span>
        </NavLink>
      </nav>

      <div className="logout-section">
        <button className="logout-btn" onClick={onClose}>
          <FaSignOutAlt />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
