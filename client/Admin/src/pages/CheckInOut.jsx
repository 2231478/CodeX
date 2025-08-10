import React, { useState } from "react";
import "./CheckInOut.css";

export default function CheckInOut() {
  const [activeTab, setActiveTab] = useState("Approved");

  const records = [
    { id: "0508", name: "Tom John", email: "john.tom@gmail.com", service: "Lodging", date: "April 6, 2025" },
    { id: "0508", name: "Jerome Bell", email: "jeromebell@gmail.com", service: "Event and Lodging", date: "April 5, 2025" },
    { id: "0508", name: "Wade Warren", email: "warren05@gmail.com", service: "Event", date: "April 4, 2025" },
    { id: "0508", name: "Eleanor Pena", email: "eleanorpena@gmail.com", service: "Lodging", date: "April 3, 2025" },
    { id: "0508", name: "Michelle Smith", email: "smith_mt@gmail.com", service: "Lodging", date: "April 2, 2025" },
    { id: "0508", name: "Leona Richards", email: "leanor.r01@gmail.com", service: "Lodging", date: "April 1, 2025" },
    { id: "0508", name: "Patricia Rivera", email: "patrivera@gmail.com", service: "Event and Lodging", date: "March 28, 2025" },
    { id: "0508", name: "Gabriela Bolton", email: "hsmgabbby@gmail.com", service: "Event", date: "March 19, 2025" },
    { id: "0508", name: "Carlito Pardilla", email: "par_carlitsr@gmail.com", service: "Event", date: "March 10, 2025" },
    { id: "0508", name: "Shan Camero", email: "shan01camt@gmail.com", service: "Event and Lodging", date: "Feb 20, 2025" },
    { id: "0508", name: "Sharpay Evans", email: "evans_shay@gmail.com", service: "Lodging", date: "Feb 15, 2025" },
    { id: "0508", name: "Skye Borromeo", email: "skyeb1004@gmail.com", service: "Event and Lodging", date: "Feb 1, 2025" },
    { id: "0508", name: "Diana Mendiola", email: "mend_diana@gmail.com", service: "Lodging", date: "Jan 20, 2025" },
    { id: "0508", name: "Jerome Bell", email: "jerbell@gmail.com", service: "Event", date: "Jan 18, 2025" },
    { id: "0508", name: "Luna Ereno", email: "jerbell@gmail.com", service: "Lodging", date: "Jan 10, 2025" },
  ];

  return (
    <div className="checkinout-container">
      <h1>CHECK-IN/OUT</h1>

      <div className="tabs">
        {["Approved", "Check-in", "Check-out"].map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
        <div className="search-bar">
          <input type="text" placeholder="Search" />
          <button className="search-btn">🔍</button>
          <button className="filter-btn">⚙</button>
        </div>
      </div>

      <table className="checkinout-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Service Type</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((rec, index) => (
            <tr key={index}>
              <td>{rec.id}</td>
              <td>{rec.name}</td>
              <td>{rec.email}</td>
              <td>{rec.service}</td>
              <td>{rec.date}</td>
              <td>
                <button className="check-btn">Check In</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <span>Showing 1 to 15 items</span>
        <div className="page-controls">
          <button>{"<"}</button>
          {[1, 2, 3, 4, 5].map((num) => (
            <button key={num} className={num === 1 ? "active" : ""}>{num}</button>
          ))}
          <button>{">"}</button>
        </div>
      </div>
    </div>
  );
}
