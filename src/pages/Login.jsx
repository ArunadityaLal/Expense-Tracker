import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // For navigation
import CreateAccountModal, { SignupForm } from "../modals/CreateAccountModal";

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDSaSs9KnjA81xW6JGQA1koOB_t6W6JF6k",
        {
          method: "POST",
          body: JSON.stringify({
            email: email,
            password: password,
            returnSecureToken: true,
          }),
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert("Login Successful");
        setIsLoggedIn(true); 
        localStorage.setItem("isLoggedIn",true);
        localStorage.setItem("tokenId", JSON.stringify(data.localId));
        navigate("/"); 
      } else {
        alert(data.error.message || "Something went wrong");
      }
    } catch (Error) {
      console.log(Error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-6 relative">
            <label className="block text-sm font-medium">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md pr-10"
              required
            />
            {password && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-11 transform -translate-y-1/2 text-gray-600"
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            )}
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md">
            Login
          </button>
        </form>
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-blue-500 hover:underline"
          >
            Not a user? Sign up
          </button>
        </div>
      </div>

      <CreateAccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Account"
      >
        <SignupForm
          onSubmit={() => {
            setIsModalOpen(false);
          }}
          onClose={() => setIsModalOpen(false)}
        />
      </CreateAccountModal>
    </div>
  );
};

export default Login;
