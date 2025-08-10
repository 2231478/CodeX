// Layout.jsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import "./Layout.css";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Toggle sidebar open/close
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  // Force close
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="layout">
      {/* Header with clickable hamburger */}
      <Header onHamburgerClick={toggleSidebar} />

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Overlay that closes sidebar on click */}
      {isSidebarOpen && (
        <div className="overlay" onClick={closeSidebar}></div>
      )}

      {/* Main Content */}
      <main className={`main-content ${isSidebarOpen ? "shifted" : ""}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
