import { useState, useEffect } from "react";
import { X, Check, Calendar, Tag, DollarSign, FileText } from "lucide-react";
import toast from "react-hot-toast";

const AddExpenseModal = ({ expense, categories, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    category: "",
    date: "",
  });
  const [loading, setLoading] = useState(false);

  const categoryIcons = {
    Food: "🍽️",
    Transport: "🚗",
    Utilities: "💡",
    Entertainment: "🎬",
    Shopping: "🛍️",
    Healthcare: "🏥",
    Education: "📚",
    Others: "📝",
  };

  useEffect(() => {
    if (expense) {
      setFormData({
        name: expense.name,
        amount: expense.amount.toString(),
        category: expense.category,
        date: expense.date,
      });
    } else {
      // Set today's date as default
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        name: "",
        amount: "",
        category: "",
        date: today,
      });
    }
  }, [expense]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
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

    setLoading(true);
    try {
      if (expense) {
        await onSave(expense.id, formData);
      } else {
        await onSave(formData);
      }
    } catch (error) {
      console.error('Error saving expense:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              {expense ? (
                <>
                  <Check className="w-5 h-5" />
                  Edit Expense
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  Add New Expense
                </>
              )}
            </h3>
            <button
              onClick={onClose}
              disabled={loading}
              className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200 disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Expense Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Expense Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g., Groceries, Uber ride, Netflix"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white disabled:opacity-50"
              required
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Amount (₹)
            </label>
            <input
              type="number"
              name="amount"
              placeholder="0.00"
              step="0.01"
              min="0.01"
              value={formData.amount}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white disabled:opacity-50"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={loading}
              className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white disabled:opacity-50 ${!formData.category ? "text-gray-400" : "text-gray-900"}`}
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {categoryIcons[cat]} {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              disabled={loading}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white disabled:opacity-50"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium transition-all duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-medium transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  {expense ? "Update Expense" : "Add Expense"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;