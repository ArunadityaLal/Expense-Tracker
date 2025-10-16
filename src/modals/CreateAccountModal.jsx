import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import OTPVerificationModal from "./OTPVerificationModal";
import { sendOTPEmail, verifyOTP } from "../utils/emailService";
import { supabase } from "../lib/supabase";

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

export const SignupForm = ({ onSubmit, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [pendingUserData, setPendingUserData] = useState(null);
  
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!email || !password || !fullName) {
      toast.error("Please fill in all fields");
      return;
    }

    if (fullName.trim().length < 2) {
      toast.error("Please enter your full name (at least 2 characters)");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .single();

      if (existingUser) {
        toast.error("This email is already registered. Please login instead.");
        setLoading(false);
        return;
      }

      // Send OTP email
      const loadingToast = toast.loading("Sending verification code...");
      const result = await sendOTPEmail(email, fullName);
      toast.dismiss(loadingToast);

      if (!result.success) {
        toast.error(result.error || "Failed to send verification code");
        return;
      }

      // Store user data for later
      setPendingUserData({ email, password, fullName });
      
      // Show OTP modal
      setShowOTPModal(true);
      toast.success("Verification code sent! Check your email.");

      // In development, show OTP in console
      if (result.otp && import.meta.env.DEV) {
        console.log("🔐 Development OTP:", result.otp);
        toast.success(`Dev OTP: ${result.otp}`, { duration: 5000 });
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (otpCode) => {
    if (!pendingUserData) {
      toast.error("Session expired. Please try again.");
      setShowOTPModal(false);
      return;
    }

    try {
      // Verify OTP
      const result = await verifyOTP(pendingUserData.email, otpCode);

      if (!result.success) {
        toast.error(result.error || "Invalid OTP. Please try again.");
        return;
      }

      // OTP verified, now create the account
      const createToast = toast.loading("Creating your account...");

      // Create account with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: pendingUserData.email,
        password: pendingUserData.password,
        options: {
          data: {
            full_name: pendingUserData.fullName,
          },
        },
      });
      
      toast.dismiss(createToast);

      if (error) {
        console.error("Account creation error:", error);
        toast.error(error.message || "Failed to create account.");
        return;
      }
      
      if (data?.user) {
        // Account created successfully
        toast.success("Account created successfully!");
        
        // Close modals
        setShowOTPModal(false);
        setPendingUserData(null);
        if (onClose) onClose();
        
        // Auto-login the user
        const loginToast = toast.loading("Logging you in...");
        
        const { error: signInError } = await signIn(
          pendingUserData.email, 
          pendingUserData.password
        );
        
        toast.dismiss(loginToast);
        
        if (signInError) {
          console.error("Auto-login error:", signInError);
          toast.error("Account created! Please login manually.");
        } else {
          toast.success("Welcome to TrackTally! 🎉");
          // Navigate to home page
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("Verification failed. Please try again.");
    }
  };

  const handleResendOTP = async () => {
    if (!pendingUserData) {
      toast.error("Session expired. Please try again.");
      return;
    }

    try {
      const result = await sendOTPEmail(pendingUserData.email, pendingUserData.fullName);

      if (!result.success) {
        toast.error(result.error || "Failed to resend code");
        return;
      }

      toast.success("Verification code resent!");

      // In development, show OTP in console
      if (result.otp && import.meta.env.DEV) {
        console.log("🔐 Development OTP:", result.otp);
        toast.success(`Dev OTP: ${result.otp}`, { duration: 5000 });
      }
    } catch (error) {
      console.error("Resend error:", error);
      toast.error("Failed to resend code. Please try again.");
    }
  };

  const handleCloseOTPModal = () => {
    setShowOTPModal(false);
    setPendingUserData(null);
  };

  return (
    <>
      <form onSubmit={handleCreateAccount} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <span className="flex items-center gap-2">
              <span className="text-lg">👤</span>
              Full Name
            </span>
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:bg-white"
            placeholder="Enter your full name"
            required
            disabled={loading}
            minLength={2}
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
            disabled={loading}
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
              placeholder="Create a strong password (min 6 characters)"
              required
              disabled={loading}
              minLength={6}
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
          {password && password.length > 0 && password.length < 6 && (
            <p className="mt-1 text-xs text-red-500">
              Password must be at least 6 characters
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium transition-all duration-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white py-3 px-6 rounded-xl font-medium transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending Code...
              </span>
            ) : (
              "Create Account"
            )}
          </button>
        </div>

        {/* Terms */}
        <div className="text-center pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </form>

      {/* OTP Verification Modal */}
      <OTPVerificationModal
        isOpen={showOTPModal}
        onClose={handleCloseOTPModal}
        email={pendingUserData?.email || ""}
        onVerifySuccess={handleVerifyOTP}
        onResendOTP={handleResendOTP}
      />
    </>
  );
};

export default CreateAccountModal;