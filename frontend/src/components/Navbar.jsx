import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import React, { useState } from "react";
import tempLogo from "../assets/tempLogo.png";

const Navbar = ({ handleLogout, userName, admin, setPosts, filter, navSearch, setNavSearch }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const body = { navSearch, filter };
        const response = await fetch("http://localhost:5001/api/navSearch", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        setPosts(data);
        navigate("/");
    } catch (error) {
        console.log(error);
    }
  }

  return (
    <div className="fixed flex top-0 w-full h-[75px] bg-gray-800 px-4 z-50 items-center justify-between shadow-md">
      {/* Left Section: Logo, Page By Page, and Welcome */}
      <div className="flex items-center w-1/5 space-x-4">
        {/* Logo */}
        <Link to="/">
          <img src={tempLogo} alt="Logo" className="w-[50px] h-[50px] cursor-pointer" />
        </Link>
        {/* Page By Page */}
        <div className="hidden md:flex flex-col">
          <Link to="/">
            <span className="text-2xl font-semibold text-[#e0f7fa]">Page By Page</span>
          </Link>
          <span className="text-sm text-white">Welcome {userName || "Guest"}!</span>
        </div>
      </div>
      {/* Search Bar: Centered */}
      <div className="flex justify-center items-center w-3/5 mx-4">
        <div className="relative flex items-center bg-white rounded-lg px-2 w-full md:max-w-[400px]">
          <input
            className="w-full h-[35px] pl-10 rounded-lg border-none outline-none text-sm text-gray-800"
            type="text"
            placeholder="Search..."
            required
            value={navSearch}
            onChange={(e) => setNavSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }
            } 
          />
          <FaSearch className="absolute left-3 h-[20px] w-[20px] text-gray-600 cursor-pointer" onClick={handleSubmit}/>
        </div>
      </div>
      {/* Navigation Links: Right */}
      <ul className="hidden md:flex flex-row items-center justify-end w-1/5 space-x-4 text-white">
        {admin && (
          <li className={`font-bold hover:text-blue-400 ${currentPath.startsWith("/admin") ? "underline" : ""}`}>
            <Link to="/admin/dashboard">Admin</Link>
          </li>
        )}
        <li className={`font-bold hover:text-blue-400 ${currentPath === "/" ? "underline" : ""}`}>
          <Link to="/home">Home</Link>
        </li>
        <li className="font-bold hover:text-blue-400">
          <Link to="/create" className={currentPath === "/create" ? "underline" : ""}>
            Create
          </Link>
        </li>
        <li className="font-bold hover:text-blue-400">
          <Link to="/orders" className={currentPath === "/orders" ? "underline" : ""}>
            Orders
          </Link>
        </li>
        <li className="font-bold hover:text-blue-400">
          <Link to="/cart" className={currentPath === "/cart" ? "underline" : ""}>
            Cart
          </Link>
        </li>
        <li className="font-bold hover:text-blue-400">
          <Link to="/contact" className={currentPath === "/contact" ? "underline" : ""}>
            Contact
          </Link>
        </li>
        <li className="font-bold hover:text-blue-400">
          <button onClick={handleLogout}>Logout</button>
        </li>
      </ul>
      {/* Mobile Menu Button */}
      <button className="md:hidden flex items-center" onClick={toggleMenu}>
        <div className="w-4 h-4 flex flex-col justify-between">
          <span className="block w-full h-[3px] bg-white"></span>
          <span className="block w-full h-[3px] bg-white"></span>
          <span className="block w-full h-[3px] bg-white"></span>
        </div>
      </button>
      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-1/3 bg-blue-600 shadow-lg transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <button
          className="absolute top-4 right-4 text-white text-xl"
          onClick={toggleMenu}
        >
          &times;
        </button>
        <ul className="flex flex-col justify-center items-center space-y-6 text-white mt-12">
          {admin && (
            <li className="font-bold hover:text-blue-400">
              <Link to="/admin/dashboard" onClick={toggleMenu}>
                Admin
              </Link>
            </li>
          )}
          <li className="font-bold hover:text-blue-400">
            <Link to="/home" onClick={toggleMenu}>
              Home
            </Link>
          </li>
          <li className="font-bold hover:text-blue-400">
            <Link to="/create" onClick={toggleMenu}>
              Create
            </Link>
          </li>
          <li className="font-bold hover:text-blue-400">
            <Link to="/orders" onClick={toggleMenu}>
              Orders
            </Link>
          </li>
          <li className="font-bold hover:text-blue-400">
            <Link to="/cart" onClick={toggleMenu}>
              Cart
            </Link>
          </li>
          <li className="font-bold hover:text-blue-400">
            <Link to="/contact" onClick={toggleMenu}>
              Contact
            </Link>
          </li>
          <li className="font-bold hover:text-blue-400">
            <button onClick={() => [toggleMenu(), handleLogout()]}>Logout</button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;