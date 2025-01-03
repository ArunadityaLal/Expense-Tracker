import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom"; 
import Navbar from "./components/Navbar";
import AboutUs from "./pages/AboutUs";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PersonalExpense from "./pages/PersonalExpense";
import Groups from "./pages/Groups";
import GroupExpense from "./pages/GroupExpense";
import Footer from "./components/Footer";

const App = () => {
  
  const statusStr = localStorage.getItem("isLoggedIn");
  const status = statusStr ? true : false ;
  const [isLoggedIn, setIsLoggedIn] = useState(status);
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn}/>} />
          {status && <Route
            path="/add-expense"
            element={
            <PersonalExpense />  
            }
          />}

          {status && <Route
            path="/group-expense"
            element={
               <Groups/>
            }
          />}

            {status && <Route path="/group/:name" element={
               <GroupExpense/> 
            } />}

            <Route path = "*" element = {<Home />}></Route>
        </Routes>
      </div>

      <Footer />
    </div>
  );
};

export default App;
