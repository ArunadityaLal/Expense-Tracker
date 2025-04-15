import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import AddExpenseModal from "../modals/AddExpenseModal";
import { FiTrash2 } from "react-icons/fi";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { TiUserAdd } from "react-icons/ti";
import SettleUpModal from "../modals/SettleUpModal";
import AddNamesModal from "../modals/AddNamesModal";

const GroupExpense = () => {
  const { state } = useLocation();
  const { name = "Unknown Group", memberNames = [] } = state || {};
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
  }, [groupName, date]);

  

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

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100 p-20">
      <div className="mb-6 rounded-lg bg-blue-500 p-4 text-white">
        <h2 className="text-2xl font-bold">{groupName}</h2>
      </div>

      {loading ? (
        <p className="text-center text-lg text-gray-400">Loading expenses...</p>
      ) : groupExpenses.length === 0 ? (
        <p className="text-center text-lg text-gray-400">
          No Expenses Added yet.
        </p>
      ) : (
        <div className="w-full max-w-lg">
          {sortedGroupExpenses?.map((item, index) => (
            <div key={index} className="mb-4 rounded-lg bg-white p-4 shadow-md">
              <h3 className="text-lg font-semibold">
                {item.name || "Unnamed Expense"}
              </h3>
              <ul className="list-none p-0">
                <li className="flex items-center justify-between py-2">
                  <div className="flex flex-col">
                    <span>{`€${item.amount ?? "0.00"}`}</span>
                    <span className="text-sm text-gray-500">
                      Paid by {item.paidBy || "Unknown"}
                    </span>
                  </div>
                  <p>{item.date}</p>
                  <button
                    className="ml-4 text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteExpense(item.date, item.id)}
                    aria-label={`Delete expense ${item.name}`}
                  >
                    <FiTrash2 className="h-5 w-5" />
                  </button>
                </li>
              </ul>
            </div>
          ))}
        </div>
      )}

      {groupExpenses.length > 0 && (
        <button
          onClick={() => setShowSettleUp(true)}
          className="fixed bottom-8 left-1/2 flex -translate-x-1/2 transform items-center justify-center gap-2 rounded-full bg-green-500 px-6 py-3 text-white shadow-lg hover:bg-green-600"
        >
          <FaFileInvoiceDollar className="h-5 w-5" />
          <span>Settle Up</span>
        </button>
      )}
      {showSettleUp && (
        <SettleUpModal
          groupExpenses={groupExpenses}
          memberNames={memberNames}
          closeModal={() => setShowSettleUp(false)}
        />
      )}

      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-8 right-8 flex h-14 w-14 items-center justify-center rounded-full bg-black text-2xl text-white shadow-lg"
      >
        +
      </button>

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

      <button
        onClick={openNamesModal}
        className={`fixed bottom-24 right-9 flex h-14 w-14 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg ${isDisabled ? "cursor-not-allowed opacity-50" : ""}`}
        disabled={isDisabled}
      >
        <TiUserAdd className="h-6 w-6" />
      </button>
      {addNames && (
        <AddNamesModal
          setAddNames={setAddNames}
          groupName={groupName}
          onSaveSuccess={() => setIsDisabled(true)}
        />
      )}
    </div>
  );
};

export default GroupExpense;