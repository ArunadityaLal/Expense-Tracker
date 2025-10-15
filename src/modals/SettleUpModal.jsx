import React from "react";
import Splitwise from "../splitwise/Splitwise";

const SettleUpModal = ({ closeModal, memberNames, groupExpenses }) => {
  const paidByArray = groupExpenses.map(expense => expense.paid_by);
  const amountArray = groupExpenses.map(expense => parseFloat(expense.amount));

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
      <div className="rounded-2xl bg-white shadow-2xl w-full max-w-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-teal-600 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">Settlement Summary</h2>
        </div>

        <div className="p-6">
          <Splitwise 
            memberNames={memberNames} 
            paidBy={paidByArray} 
            amount={amountArray} 
          />
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={closeModal}
              className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-medium py-3 px-6 rounded-xl transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettleUpModal;