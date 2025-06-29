import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import AddExpenseModal from "../modals/AddExpenseModal";
import { FiTrash2 } from "react-icons/fi";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { TiUserAdd } from "react-icons/ti";
import SettleUpModal from "../modals/SettleUpModal";
import AddNamesModal from "../modals/AddNamesModal";

const GroupExpense = () => {
  const { state } = useLocation();
  const { memberNames = [] } = state || {};
  const { name: groupName } = useParams();

  const [showModal, setShowModal] = useState(false);
  const [showSettleUp, setShowSettleUp] = useState(false);
  const [groupExpenses, setGroupExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addNames, setAddNames] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [date, setDate] = useState("");
  const [itemName, setItemName] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");

  useEffect(() => {
    const fetchGroupExpenses = async () => {
      const uidString = localStorage.getItem("tokenId");
      if (!uidString) {
        console.error("User token not found.");
        return;
      }

      const uid = JSON.parse(uidString);

      try {
        const response = await fetch(
          `https://expense-tracker-7880f-default-rtdb.firebaseio.com/${uid}/split-smart/${groupName}.json`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch expenses");
        }

        const data = await response.json();

        if (data) {
          console.log(memberNames);
          if (memberNames.length > 0) {
            setIsDisabled(true);
          }
          const expensesArray = [];

          for (const date in data) {
            const value = data[date];

            if (value && typeof value === "object") {
              for (const key in value) {
                const expense = value[key];

                if (
                  expense &&
                  expense.name &&
                  expense.amount &&
                  expense.paidBy
                ) {
                  expensesArray.push({
                    date,
                    name: expense.name,
                    amount: expense.amount,
                    paidBy: expense.paidBy,
                  });
                }
              }
            }
          }

          setGroupExpenses(expensesArray);
        } else {
          setGroupExpenses([]);
        }
      } catch (error) {
        console.error("Error fetching expenses:", error);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchGroupExpenses();
  }, [groupName, date, memberNames]);

  

  const handleDeleteExpense = async (expenseId) => {
    

    const uid = JSON.parse(localStorage.getItem("tokenId"));

    try {
      const response = await fetch(
        `https://expense-tracker-7880f-default-rtdb.firebaseio.com/${uid}/split-smart/${groupName}/${date}/${expenseId}.json`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete expense");
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
      setGroupExpenses(groupExpenses);
    }
  };

  const sortedGroupExpenses = [...groupExpenses]
    .filter((expense) => expense.date)
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA;
    });

  const openNamesModal = () => {
    setAddNames(true);
  };

  const totalAmount = groupExpenses.reduce((total, expense) => total + parseFloat(expense.amount || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-20">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-teal-600 rounded-full mb-6 shadow-lg">
            <span className="text-3xl">👥</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-4">
            {groupName}
          </h1>
          <p className="text-gray-600 text-lg">Track and manage group expenses</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2"></div>
            <div className="p-6 text-center">
              <div className="text-3xl font-bold text-gray-800">€{totalAmount.toFixed(2)}</div>
              <div className="text-sm text-gray-600 mt-1">Total Spent</div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-teal-600 h-2"></div>
            <div className="p-6 text-center">
              <div className="text-3xl font-bold text-gray-800">{groupExpenses.length}</div>
              <div className="text-sm text-gray-600 mt-1">Expenses</div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 h-2"></div>
            <div className="p-6 text-center">
              <div className="text-3xl font-bold text-gray-800">{memberNames.length || 0}</div>
              <div className="text-sm text-gray-600 mt-1">Members</div>
            </div>
          </div>
        </div>

        {/* Expenses List */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-lg text-gray-600">Loading expenses...</p>
          </div>
        ) : groupExpenses.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
              <span className="text-4xl text-gray-400">📋</span>
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">No expenses yet</h3>
            <p className="text-gray-600 mb-8">Start adding expenses to track group spending</p>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Expenses</h2>
            {sortedGroupExpenses?.map((item, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-3">
                        <span className="text-white text-xl">💰</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {item.name || "Unnamed Expense"}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Paid by <span className="font-medium text-blue-600">{item.paidBy || "Unknown"}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-800">€{item.amount ?? "0.00"}</div>
                        <div className="text-sm text-gray-500">{item.date}</div>
                      </div>
                      <button
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all duration-200"
                        onClick={() => handleDeleteExpense(item.date, item.id)}
                        aria-label={`Delete expense ${item.name}`}
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Floating Action Buttons */}
        {groupExpenses.length > 0 && (
          <button
            onClick={() => setShowSettleUp(true)}
            className="fixed bottom-8 left-1/2 flex -translate-x-1/2 transform items-center justify-center gap-3 rounded-full bg-gradient-to-r from-green-500 to-teal-600 px-8 py-4 text-white shadow-2xl hover:from-green-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105"
          >
            <FaFileInvoiceDollar className="h-5 w-5" />
            <span className="font-semibold">Settle Up</span>
          </button>
        )}

        <button
          onClick={() => setShowModal(true)}
          className="fixed bottom-8 right-8 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-2xl hover:from-blue-600 hover:to-purple-700 transform hover:scale-110 transition-all duration-200"
        >
          <span className="text-2xl font-light">+</span>
        </button>

        <button
          onClick={openNamesModal}
          className={`fixed bottom-28 right-8 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-xl hover:from-orange-600 hover:to-red-700 transform hover:scale-110 transition-all duration-200 ${isDisabled ? "cursor-not-allowed opacity-50" : ""}`}
          disabled={isDisabled}
        >
          <TiUserAdd className="h-6 w-6" />
        </button>

        {/* Modals */}
        {showSettleUp && (
          <SettleUpModal
            groupExpenses={groupExpenses}
            memberNames={memberNames}
            closeModal={() => setShowSettleUp(false)}
          />
        )}

        {showModal && (
          <AddExpenseModal
            date={date}
            groupName={groupName}
            setDate={setDate}
            itemName={itemName}
            setItemName={setItemName}
            amount={amount}
            setAmount={setAmount}
            paidBy={paidBy}
            setPaidBy={setPaidBy}
            memberNames={memberNames}
            groupExpenses={groupExpenses}
            setShowModal={setShowModal}
            setGroupExpenses={setGroupExpenses}
            closeModal={() => setShowModal(false)}
          />
        )}

        {addNames && (
          <AddNamesModal
            setAddNames={setAddNames}
            groupName={groupName}
            onSaveSuccess={() => setIsDisabled(true)}
          />
        )}
      </div>
    </div>
  );
};

export default GroupExpense;