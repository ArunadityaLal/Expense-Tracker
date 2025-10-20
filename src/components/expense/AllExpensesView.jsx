import { useState } from "react";
import { Edit2, Trash2, Filter, Tag, Calendar as CalendarIcon } from "lucide-react";

const AllExpensesView = ({ expenses, categories, onEdit, onDelete }) => {
  const [categoryFilter, setCategoryFilter] = useState("");

  const categoryColors = {
    Food: "bg-orange-100 text-orange-800 border-orange-200",
    Transport: "bg-blue-100 text-blue-800 border-blue-200", 
    Utilities: "bg-green-100 text-green-800 border-green-200",
    Entertainment: "bg-purple-100 text-purple-800 border-purple-200",
    Shopping: "bg-pink-100 text-pink-800 border-pink-200",
    Healthcare: "bg-red-100 text-red-800 border-red-200",
    Education: "bg-indigo-100 text-indigo-800 border-indigo-200",
    Others: "bg-gray-100 text-gray-800 border-gray-200",
  };

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

  const filteredExpenses = categoryFilter
    ? expenses.filter((exp) => exp.category === categoryFilter)
    : expenses;

  const totalFiltered = filteredExpenses.reduce(
    (total, exp) => total + parseFloat(exp.amount),
    0
  );

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter by Category
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {categoryIcons[cat]} {cat}
              </option>
            ))}
          </select>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white text-center min-w-[180px]">
          <div className="text-2xl font-bold">₹{totalFiltered.toFixed(2)}</div>
          <div className="text-sm text-blue-100">
            {filteredExpenses.length} expense{filteredExpenses.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
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
                      ₹{parseFloat(exp.amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${categoryColors[exp.category]}`}>
                        {categoryIcons[exp.category]} {exp.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4" />
                        {new Date(exp.date).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onEdit(exp)}
                          className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition-all duration-200"
                          aria-label="Edit Expense"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(exp.id)}
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
                      <span className="text-5xl">📋</span>
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
  );
};

export default AllExpensesView;