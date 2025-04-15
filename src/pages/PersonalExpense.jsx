import React, { useEffect, useState } from "react";

const PersonalExpense = () => {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    category: "",
    date: "",
  });

  useEffect(() => {
    const getExpense = async () => {
      const uidString = localStorage.getItem("tokenId");
      const uid = JSON.parse(uidString);

      try {
        const response = await fetch(
          `https://expense-tracker-7880f-default-rtdb.firebaseio.com/${uid}.json`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch expenses");
        }

        const data = await response.json();

        const expenses = Object.keys(data)
          .filter((key) => key !== "split-smart") // Exclude "split-smart"
          .map((key) => ({
            ...data[key],
            id: key, // Include the Firebase key
          }));

        setExpenses(expenses);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    getExpense();
  }, []);

  const [categoryFilter, setCategoryFilter] = useState("");

  const categories = [
    "Food",
    "Transport",
    "Utilities",
    "Entertainment",
    "Others",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFilterChange = (e) => {
    setCategoryFilter(e.target.value);
  };

  const addExpense = async (e) => {
    e.preventDefault();

    // Validate form data
    const { name, amount, category, date } = formData;
    if (!name || !amount || !category || !date) {
      console.error("All fields are required");
      return;
    }
    console.log(name, amount, category, date);

    const uidString = localStorage.getItem("tokenId");
    const uid = JSON.parse(uidString);
    console.log(uid);

    try {
      const response = await fetch(
        `https://expense-tracker-7880f-default-rtdb.firebaseio.com/${uid}.json`,
        {
          method: "POST",
          body: JSON.stringify({ name, amount, category, date }),
          headers: { "Content-Type": "application/json" },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to add expense");
      }

      const data = await response.json();
      console.log("Expense successfully added:", data);

      handleSubmit();
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  const handleSubmit = () => {
    if (
      formData.name &&
      formData.amount &&
      formData.date &&
      formData.category
    ) {
      setExpenses([...expenses, { ...formData }]);
      setFormData({ name: "", amount: "", category: "", date: "" });
    }
  };

  const handleDelete = async (id) => {
    const uidString = localStorage.getItem("tokenId");
    const uid = JSON.parse(uidString);

    try {
      await fetch(
        `https://expense-tracker-7880f-default-rtdb.firebaseio.com/${uid}/${id}.json`,
        {
          method: "DELETE",
        },
      );
      // Update the state to remove the deleted expense
      setExpenses((prev) => prev.filter((expense) => expense.id !== id));
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const filteredExpenses = categoryFilter
    ? expenses.filter((exp) => exp.category === categoryFilter)
    : expenses;

  const totalAmount = filteredExpenses.reduce(
    (total, exp) => total + parseFloat(exp.amount),
    0,
  );

  return (
    <div className="mx-auto mt-6 max-w-3xl rounded-lg bg-white p-20 shadow-lg">
      <h2 className="mb-4 text-center text-2xl font-bold">Expense Tracker</h2>

      {/* Form Section */}
      <form
        onSubmit={addExpense}
        className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2"
      >
        <input
          type="text"
          name="name"
          placeholder="Expense Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full rounded border p-2"
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          className="w-full rounded border p-2"
        />
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={`w-full rounded border p-2 ${!formData.category ? "text-gray-400" : "text-black"}`}
        >
          <option value="" disabled className="text-gray-400">
            Add Expense Category
          </option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full rounded border p-2"
        />
        <button
          type="submit"
          className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 md:col-span-2"
        >
          Add Expense
        </button>
      </form>

      {/* Category Filter Section */}
      <div className="mb-6">
        <label htmlFor="categoryFilter" className="mb-2 block">
          Filter by Category
        </label>
        <select
          id="categoryFilter"
          value={categoryFilter}
          onChange={handleFilterChange}
          className="w-full rounded border p-2"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Total Amount Section */}
      <div className="mb-6 text-right">
        <h3 className="text-xl font-semibold">
          Total Amount: ${totalAmount.toFixed(2)}
        </h3>
      </div>

      {/* Expense Table */}
      <div>
        <h3 className="mb-2 text-lg font-semibold">Expense List</h3>
        <table className="w-full table-auto border-collapse text-left">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Expense Name</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Date</th>
              <th className="border p-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.length > 0 ? (
              filteredExpenses.map((exp, index) => (
                <tr key={exp.id} className="hover:bg-gray-50">
                  <td className="border p-2">{exp.name}</td>
                  <td className="border p-2">
                    ${parseFloat(exp.amount).toFixed(2)}
                  </td>
                  <td className="border p-2">{exp.category}</td>
                  <td className="border p-2">{exp.date}</td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => handleDelete(exp.id)}
                      className="text-red-500 hover:text-red-700"
                      aria-label="Delete Expense"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="border p-2 text-center" colSpan="5">
                  No expenses added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PersonalExpense;
