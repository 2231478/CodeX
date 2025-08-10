// client/Admin/src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Dashboard from "./pages/Dashboard";
import Reservations from "./pages/Reservations";
import Facilities from "./pages/Facilities";
import Transactions from "./pages/Transactions";
import User from "./pages/User";
import Reports from "./pages/Reports";
import CheckInOut from "./pages/CheckInOut";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Default route when visiting "/" */}
          <Route index element={<Dashboard />} />

          {/* Other pages */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="reservations" element={<Reservations />} />
          <Route path="facilities" element={<Facilities />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="user" element={<User />} />
          <Route path="checkin" element={<CheckInOut />} />
          <Route path="reports" element={<Reports />} />

          {/* Redirect unknown paths */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
