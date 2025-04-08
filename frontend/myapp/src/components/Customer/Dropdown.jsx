import React, { useContext, useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { FaBaby } from "react-icons/fa";
import { HiOutlineLogout } from "react-icons/hi";
import { RiVipDiamondLine } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "./AuthContext";

const UserIconDropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { hasToken, setHasToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userID");
    sessionStorage.removeItem("userRole");
    setHasToken(false);
    setIsDropdownOpen(false);
    navigate("/");
    toast.error("Logged out successfully!");
  };

  if (!hasToken) {
    return null;
  }

  return (
    <li
      className="nav-item dropdown d-flex align-items-center"
      style={{ marginLeft: "50px", position: "relative" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link to="#" className="nav-link" id="userDropdown">
        <img
          src="/images/user.png"
          alt="User"
          style={{
            width: "25px",
            borderRadius: "50%",
            verticalAlign: "middle",
          }}
        />
      </Link>

      {isDropdownOpen && (
        <div
          className="dropdown-menu dropdown-menu-right"
          aria-labelledby="userDropdown"
          style={{
            position: "absolute",
            top: "100%",
            display: "block",
          }}
        >
          <Link className="dropdown-item" to="/profile">
            <FaRegUserCircle /> View Profile
          </Link>
          <Link className="dropdown-item" to="/profilePregnancy">
            <FaBaby /> View Profile Pregnancy
          </Link>
          <Link className="dropdown-item" to="/viewAppointment">
            <RiVipDiamondLine /> View Appointments
          </Link>
          <button className="dropdown-item" onClick={handleLogout}>
            <HiOutlineLogout /> Logout
          </button>
        </div>
      )}
    </li>
  );
};

export default UserIconDropdown;