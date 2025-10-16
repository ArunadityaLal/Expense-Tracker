import React from "react";
import { Routes, Route, Navigate } from "react-router-dom"; 
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import AboutUs from "./pages/AboutUs";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PersonalExpense from "./pages/PersonalExpense";
import Groups from "./pages/Groups";
import GroupExpense from "./pages/GroupExpense";
import LearnMore from "./pages/LearnMore";
import ContactUs from "./pages/ContactUs";
import Footer from "./components/Footer";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const App = () => {
  const { user } = useAuth();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/learn-more" element={<LearnMore />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/add-expense"
            element={
              <ProtectedRoute>
                <PersonalExpense />  
              </ProtectedRoute>
            }
          />

          <Route
            path="/group-expense"
            element={
              <ProtectedRoute>
                <Groups/>
              </ProtectedRoute>
            }
          />

          <Route 
            path="/group/:name" 
            element={
              <ProtectedRoute>
                <GroupExpense/> 
              </ProtectedRoute>
            } 
          />

          <Route path="*" element={<Home />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
};

export default App;