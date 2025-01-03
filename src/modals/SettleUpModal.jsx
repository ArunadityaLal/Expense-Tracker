import React from "react";
import Splitwise from "../splitwise/Splitwise";

const SettleUpModal = ({ closeModal, memberNames, groupExpenses }) => {
  const paidByArray = [];
  const amountArray = [];

  groupExpenses.forEach((day) => {  
      paidByArray.push(day.paidBy);
      amountArray.push(day.amount);
  })
  console.log(memberNames);


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Settle Up</h2>

        {/* Pass necessary props to Splitwise */}
        <Splitwise memberNames={memberNames} paidBy={paidByArray} amount={amountArray} />
          
        <button
          onClick={closeModal}
          className="mt-4 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SettleUpModal;
