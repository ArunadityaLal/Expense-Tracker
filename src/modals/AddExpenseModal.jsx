import React from 'react';

const AddExpenseModal = ({
  date,
  groupName,
  setDate,
  itemName,
  setItemName, 
  amount,
  setAmount, 
  paidBy, 
  setPaidBy,
  memberNames,
  closeModal,
  setShowModal,
  groupExpenses,
  setGroupExpenses
}) => {

  const handleAddExpense = async () => {
    if (date && itemName && amount && paidBy) {
      const newItem = {
        name: itemName,
        amount: parseFloat(amount),
        paidBy,
      };
  
      const updatedExpenses = [...groupExpenses];
      const dateIndex = updatedExpenses.findIndex(
        (expense) => expense.date === date,
      );
  
      if (dateIndex >= 0) {
        // Ensure items array exists before pushing
        if (!updatedExpenses[dateIndex].items) {
          updatedExpenses[dateIndex].items = [];
        }
        updatedExpenses[dateIndex].items.push(newItem);
      } else {
        updatedExpenses.push({
          date, // Add the date for context
          items: [newItem], // Initialize with the new item
        });
      }
  
      setGroupExpenses(updatedExpenses);
      setDate("");
      setItemName("");
      setAmount("");
      setPaidBy("");
      setShowModal(false);
  
      try {
        const uidString = localStorage.getItem("tokenId");
        const uid = JSON.parse(uidString);
  
        await fetch(
          `https://expense-tracker-204b0-default-rtdb.firebaseio.com/${uid}/split-smart/${groupName}/${date}.json`,
          {
            method: "POST",
            body: JSON.stringify(newItem),
          },
        );
      } catch (error) {
        console.error("Error adding expense:", error);
      }
    } else {
      alert("Please fill in all fields.");
    }
  };
  

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Add Expense</h3>
        
        <div className="mb-2">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date:
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="mb-2">
          <label htmlFor="itemName" className="block text-sm font-medium text-gray-700">
            Item Name:
          </label>
          <input
            type="text"
            id="itemName"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="mb-2">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount (€):
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="mb-2">
          <label htmlFor="paidBy" className="block text-sm font-medium text-gray-700">
            Paid By:
          </label>
          <select
            id="paidBy"
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select</option>
            {memberNames.map((member, index) => (
              <option key={index} value={member}>
                {member}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex justify-end mt-4">
          <button
            onClick={closeModal}
            className="mr-2 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleAddExpense}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Expense
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddExpenseModal;