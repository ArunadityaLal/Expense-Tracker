import { useEffect, useState } from "react";
import { PlusCircle, Filter, DollarSign, Trash2, Calendar, Tag, Receipt } from "lucide-react";

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
          .filter((key) => key !== "split-smart")
          .map((key) => ({
            ...data[key],
            id: key,
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

  const categoryColors = {
    Food: "bg-orange-100 text-orange-800 border-orange-200",
    Transport: "bg-blue-100 text-blue-800 border-blue-200", 
    Utilities: "bg-green-100 text-green-800 border-green-200",
    Entertainment: "bg-purple-100 text-purple-800 border-purple-200",
    Others: "bg-gray-100 text-gray-800 border-gray-200",
  };

  const categoryIcons = {
    Food: "🍽️",
    Transport: "🚗",
    Utilities: "💡",
    Entertainment: "🎬",
    Others: "📝",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFilterChange = (e) => {
    setCategoryFilter(e.target.value);
  };

  const addExpense = async (e) => {
    e.preventDefault();

    const { name, amount, category, date } = formData;
    if (!name || !amount || !category || !date) {
      console.error("All fields are required");
      return;
    }

    const uidString = localStorage.getItem("tokenId");
    const uid = JSON.parse(uidString);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <Receipt className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Expense Tracker</h1>
          <p className="text-gray-600">Track your expenses and manage your budget efficiently</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Expense Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <PlusCircle className="w-5 h-5" />
                  Add New Expense
                </h2>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Receipt className="w-4 h-4" />
                      Expense Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter expense name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Amount
                    </label>
                    <input
                      type="number"
                      name="amount"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white ${!formData.category ? "text-gray-400" : "text-gray-900"}`}
                    >
                      <option value="" disabled>
                        Select category
                      </option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {categoryIcons[cat]} {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    />
                  </div>
                </div>

                <button
                  onClick={addExpense}
                  className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 font-medium shadow-lg flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-5 h-5" />
                  Add Expense
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar - Filter and Total */}
          <div className="space-y-6">
            {/* Total Amount Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Total Amount
                </h3>
              </div>
              <div className="p-6">
                <div className="text-3xl font-bold text-gray-900">
                  ${totalAmount.toFixed(2)}
                </div>
                <p className="text-gray-600 mt-1">
                  {filteredExpenses.length} expense{filteredExpenses.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Filter Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filter Expenses
                </h3>
              </div>
              <div className="p-6">
                <select
                  value={categoryFilter}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {categoryIcons[cat]} {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Expenses Table */}
        <div className="mt-8">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4">
              <h3 className="text-xl font-semibold text-white">Expense History</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Expense Name</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Date</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredExpenses.length > 0 ? (
                    filteredExpenses.map((exp) => (
                      <tr key={exp.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">{exp.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                          ${parseFloat(exp.amount).toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${categoryColors[exp.category]}`}>
                            {categoryIcons[exp.category]} {exp.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{exp.date}</td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleDelete(exp.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-200"
                            aria-label="Delete Expense"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-6 py-12 text-center text-gray-500" colSpan="5">
                        <div className="flex flex-col items-center gap-2">
                          <Receipt className="w-12 h-12 text-gray-300" />
                          <p className="text-lg font-medium">No expenses yet</p>
                          <p className="text-sm">Add your first expense to get started</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalExpense;