import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import expenses from "../assets/expenses.png";
import ProfileDropdown from "./ProfileDropdown";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 backdrop-blur-xl border-b border-white/10 fixed top-0 left-0 w-full z-50 shadow-2xl">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-sm group-hover:blur-md transition-all duration-300"></div>
              <img
                src={expenses}
                alt="expenses"
                className="relative h-12 w-12 rounded-full border-2 border-white/20 group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                TrackTally
              </h2>
              <div className="text-xs text-purple-300 font-medium">Expense Manager</div>
            </div>
          </Link>

          {/* Navigation Links */}
          <ul className="flex items-center space-x-8">
            {user ? (
              <>
                <li>
                  <Link 
                    to="/add-expense" 
                    className="relative text-white/90 hover:text-white font-medium transition-all duration-300 group px-4 py-2"
                  >
                    <span className="relative z-10">MY FINANCE</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-600/0 group-hover:from-blue-500/20 group-hover:to-purple-600/20 rounded-lg transition-all duration-300"></div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 group-hover:w-full transition-all duration-300"></div>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/group-expense" 
                    className="relative text-white/90 hover:text-white font-medium transition-all duration-300 group px-4 py-2"
                  >
                    <span className="relative z-10">SPLIT SMART</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 to-teal-600/0 group-hover:from-green-500/20 group-hover:to-teal-600/20 rounded-lg transition-all duration-300"></div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-green-400 to-teal-500 group-hover:w-full transition-all duration-300"></div>
                  </Link>
                </li>
                <li>
                  <ProfileDropdown />
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link 
                    to="/about-us" 
                    className="relative text-white/90 hover:text-white font-medium transition-all duration-300 group px-4 py-2"
                  >
                    <span className="relative z-10">ABOUT US</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-600/0 group-hover:from-blue-500/20 group-hover:to-purple-600/20 rounded-lg transition-all duration-300"></div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 group-hover:w-full transition-all duration-300"></div>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/login" 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    LOGIN
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
      
      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
    </nav>
  );
};

export default Navbar;