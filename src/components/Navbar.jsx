import React from "react";
import { Link, useNavigate } from "react-router-dom";
import expenses from "../assets/expenses.png";

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false); 
    alert("Logged out successfully");
    navigate("/"); 
  };

  return (
    <nav className="bg-gray-500 p-4 fixed top-0 left-0 w-full z-10">
      <div className="container mx-auto flex items-center">
        <Link to="/" className="flex">
          <img
            src={expenses}
            alt="expenses"
            className="h-10 w-10 mr-4"
          />
        </Link>
        <h2 className="text-white">TrackTally</h2>
        <ul className="flex space-x-14 list-none ml-auto">
          {isLoggedIn ? (
            <>
              <li>
                <Link to="/add-expense" className="text-white hover:text-gray-300">
                  MY FINANCE
                </Link>
              </li>
              <li>
                <Link to="/group-expense" className="text-white hover:text-gray-300">
                  SPLIT SMART
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="text-white hover:text-gray-300 focus:outline-none"
                >
                  LOGOUT
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/about-us" className="text-white hover:text-gray-300">
                  ABOUT US
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-white hover:text-gray-300">
                  LOGIN
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
