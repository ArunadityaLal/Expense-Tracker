import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons

let users = JSON.parse(localStorage.getItem("users")) || [];

// eslint-disable-next-line react/prop-types
const CreateAccountModal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 w-full max-w-lg overflow-hidden relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-teal-600 px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold text-white">{title}</h3>
              <p className="text-green-100 text-sm mt-1">Join TrackTally today</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200"
            >
              <span className="text-xl">✖️</span>
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

const handleCreateAccount = async (e, email, password, name, onSubmit) => {
  e.preventDefault();
  try {
    const res = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDSaSs9KnjA81xW6JGQA1koOB_t6W6JF6k",
      {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();
    users.push({
      id: data.idToken,
      name,
    });
    localStorage.setItem("users", JSON.stringify(users));
    if (onSubmit) onSubmit();
    alert("Account Created");
  } catch (error) {
    console.error("Error:", error);
  }
};

// eslint-disable-next-line react/prop-types
export const SignupForm = ({ onSubmit, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form
      onSubmit={(e) => handleCreateAccount(e, email, password, name, onSubmit)}
      className="space-y-6"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <span className="flex items-center gap-2">
            <span className="text-lg">👤</span>
            Full Name
          </span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:bg-white"
          placeholder="Enter your full name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <span className="flex items-center gap-2">
            <span className="text-lg">📧</span>
            Email Address
          </span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:bg-white"
          placeholder="Enter your email"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <span className="flex items-center gap-2">
            <span className="text-lg">🔒</span>
            Password
          </span>
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:bg-white pr-12"
            placeholder="Create a strong password"
            required
          />
          {password && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-1/2 transform -translate-y-1/2 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium transition-all duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white py-3 px-6 rounded-xl font-medium transform hover:scale-105 transition-all duration-200 shadow-lg"
        >
          Create Account
        </button>
      </div>

      {/* Terms */}
      <div className="text-center pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </form>
  );
};

export default CreateAccountModal;