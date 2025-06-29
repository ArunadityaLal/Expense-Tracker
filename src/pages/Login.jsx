import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // For navigation
import CreateAccountModal, { SignupForm } from "../modals/CreateAccountModal";

// eslint-disable-next-line react/prop-types
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <span className="text-2xl">🔐</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-purple-100">Sign in to your account</p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                    placeholder="Enter your email"
                    required
                  />
                  <div className="absolute right-3 top-3">
                    <span className="text-white/40">📧</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm pr-12"
                    placeholder="Enter your password"
                    required
                  />
                  {password && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-white/60 hover:text-white transition-colors duration-200"
                    >
                      {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </button>
                  )}
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Sign In
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-white/20"></div>
              <span className="px-3 text-white/60 text-sm">or</span>
              <div className="flex-1 h-px bg-white/20"></div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-blue-300 hover:text-blue-200 font-medium transition-colors duration-200 hover:underline"
              >
                Do not have an account? Create one
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-black/20 p-4 text-center">
            <p className="text-white/60 text-sm">
              By signing in, you agree to our Terms & Privacy Policy
            </p>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400/60 rounded-full animate-bounce"></div>
        <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-pink-400/60 rounded-full animate-pulse"></div>
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