import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons

let users = JSON.parse(localStorage.getItem("users")) || [];

const CreateAccountModal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        {children}
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

export const SignupForm = ({ onSubmit, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form
      onSubmit={(e) => handleCreateAccount(e, email, password, name, onSubmit)}
    >
      <div className="mb-4">
        <label className="block text-sm font-medium">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mt-1 p-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Email ID</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mt-1 p-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md pr-10"
            required
          />
          {/* Conditional rendering for icons */}
          {password && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-1/2 transform -translate-y-1/2 right-2 text-sm text-gray-500"
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          )}
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="mr-4 bg-gray-300 text-gray-800 py-2 px-4 rounded-md"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md"
        >
          Create Account
        </button>
      </div>
    </form>
  );
};

export default CreateAccountModal;
