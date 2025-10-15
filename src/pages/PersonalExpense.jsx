import { useEffect, useState } from "react";
import { PlusCircle, Filter, DollarSign, Trash2, Calendar, Tag, Receipt, Edit2, X, Check } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const PersonalExpense = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    category: "",
    date: "",
  });

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

  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    fetchExpenses();
  }, [user]);

  const fetchExpenses = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('personal_expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;

      setExpenses(data || []);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
    }
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
      toast.error("All fields are required");
      return;
    }

    if (parseFloat(amount) <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

    try {
      const { data, error } = await supabase
        .from('personal_expenses')
        .insert([
          {
            user_id: user.id,
            name,
            amount: parseFloat(amount),
            category,
            date,
          }
        ])
        .select();

      if (error) throw error;

      setExpenses([data[0], ...expenses]);
      setFormData({ name: "", amount: "", category: "", date: "" });
      toast.success("Expense added successfully!");
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('Failed to add expense');
    }
  };

  const startEdit = (expense) => {
    setEditingId(expense.id);
    setFormData({
      name: expense.name,
      amount: expense.amount.toString(),
      category: expense.category,
      date: expense.date,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: "", amount: "", category: "", date: "" });
  };

  const saveEdit = async (id) => {
    const { name, amount, category, date } = formData;
    
    if (!name || !amount || !category || !date) {
      toast.error("All fields are required");
      return;
    }

    if (parseFloat(amount) <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

    try {
      const { error } = await supabase
        .from('personal_expenses')
        .update({
          name,
          amount: parseFloat(amount),
          category,
          date,
        })
        .eq('id', id);

      if (error) throw error;

      setExpenses(expenses.map(exp => 
        exp.id === id 
          ? { ...exp, name, amount: parseFloat(amount), category, date }
          : exp
      ));
      
      setEditingId(null);
      setFormData({ name: "", amount: "", category: "", date: "" });
      toast.success("Expense updated successfully!");
    } catch (error) {
      console.error('Error updating expense:', error);
      toast.error('Failed to update expense');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('personal_expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setExpenses(expenses.filter((expense) => expense.id !== id));
      toast.success("Expense deleted successfully!");
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Failed to delete expense');
    }
  };

  const filteredExpenses = categoryFilter
    ? expenses.filter((exp) => exp.category === categoryFilter)
    : expenses;

  const totalAmount = filteredExpenses.reduce(
    (total, exp) => total + parseFloat(exp.amount),
    0,
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg text-gray-600">Loading expenses...</p>
        </div>
      </div>
    );
  }

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
                  {editingId ? "Edit Expense" : "Add New Expense"}
                </h2>
              </div>
              
              <div className="p-6">
                <form onSubmit={editingId ? (e) => { e.preventDefault(); saveEdit(editingId); } : addExpense}>
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
                        step="0.01"
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

                  <div className="flex gap-3 mt-6">
                    {editingId && (
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-300 transition-all duration-200 font-medium flex items-center justify-center gap-2"
                      >
                        <X className="w-5 h-5" />
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 font-medium shadow-lg flex items-center justify-center gap-2"
                    >
                      {editingId ? (
                        <>
                          <Check className="w-5 h-5" />
                          Update Expense
                        </>
                      ) : (
                        <>
                          <PlusCircle className="w-5 h-5" />
                          Add Expense
                        </>
                      )}
                    </button>
                  </div>
                </form>
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
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">Actions</th>
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
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => startEdit(exp)}
                              className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition-all duration-200"
                              aria-label="Edit Expense"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(exp.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-200"
                              aria-label="Delete Expense"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
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