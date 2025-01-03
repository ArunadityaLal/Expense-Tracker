import React from 'react';
import expenses from "../assets/expenses.png"; 
import trackfindes from "../assets/trackfindes.png"

const Home = () => {
  return (
    <div className="bg-slate-400 h-screen flex items-center justify-center">
      <div className="bg-yellow-400 rounded-full p-10">
        <img src={expenses} alt="TrackTally-logo" className="w-40 h-40" /> 
      </div>
      <div className="text-white text-center ml-10">
        <h1 className="text-4xl font-bold">TrackTally</h1>
        <h2 className="text-2xl">Expense Manager</h2>
        <p className="mt-4">Manage your personal finances and easily track your money, expenses and budget.</p>
      </div>

      
    </div>
  );
};

export default Home;
