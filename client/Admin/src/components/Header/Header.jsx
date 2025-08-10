import React from "react";
import { FaBars, FaBell, FaUser } from "react-icons/fa";
import "./Header.css";
import webLogo from "../../assets/weblogo.png"; // correct relative path

const Header = ({ onHamburgerClick }) => {
  return (
    <header className="header">
      <div className="header-left">
        <div className="hamburger" onClick={onHamburgerClick}>
          <FaBars />
        </div>
        <img src={webLogo} alt="Website Logo" className="header-logo" />
      </div>

      <div className="header-right">
        <FaBell className="header-action header-icon" />
        <FaUser className="header-action header-icon" />
        <h1 className="header-title">Welcome Admin!</h1>
      </div>
    </header>
  );
};

export default Header;
