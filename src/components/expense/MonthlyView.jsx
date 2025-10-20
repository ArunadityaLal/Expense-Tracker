import { useState } from "react";
import { ChevronLeft, ChevronRight, Edit2, Trash2 } from "lucide-react";

const MonthlyView = ({ expenses, categories, onEdit, onDelete }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

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

  const goToPreviousMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
  };

  const goToCurrentMonth = () => {
    setSelectedDate(new Date());
  };

  // Filter expenses for selected month
  const monthlyExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    return expDate.getMonth() === selectedDate.getMonth() && 
           expDate.getFullYear() === selectedDate.getFullYear();
  });

  // Calculate totals
  const monthTotal = monthlyExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

  // Group by category
  const categoryTotals = monthlyExpenses.reduce((acc, exp) => {
    if (!acc[exp.category]) {
      acc[exp.category] = 0;
    }
    acc[exp.category] += parseFloat(exp.amount);
    return acc;
  }, {});

  // Group by date for daily breakdown
  const dailyExpenses = monthlyExpenses.reduce((acc, exp) => {
    const date = exp.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(exp);
    return acc;
  }, {});

  const sortedDates = Object.keys(dailyExpenses).sort((a, b) => new Date(b) - new Date(a));

  const monthName = selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const isCurrentMonth = selectedDate.getMonth() === new Date().getMonth() && 
                         selectedDate.getFullYear() === new Date().getFullYear();

  return (
    <div className="space-y-6">
      {/* Month Navigation */}
      <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goToPreviousMonth}
            className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="text-center">
            <h2 className="text-3xl font-bold">{monthName}</h2>
            {!isCurrentMonth && (
              <button
                onClick={goToCurrentMonth}
                className="text-sm text-green-100 hover:text-white mt-1 underline"
              >
                Go to current month
              </button>
            )}
          </div>
          
          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/20 rounded-xl p-4 text-center">
            <div className="text-sm text-green-100 mb-1">Total Spent</div>
            <div className="text-2xl font-bold">₹{monthTotal.toFixed(2)}</div>
          </div>
          <div className="bg-white/20 rounded-xl p-4 text-center">
            <div className="text-sm text-green-100 mb-1">Expenses</div>
            <div className="text-2xl font-bold">{monthlyExpenses.length}</div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      {Object.keys(categoryTotals).length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Category Breakdown</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(categoryTotals)
              .sort((a, b) => b[1] - a[1])
              .map(([category, amount]) => (
                <div
                  key={category}
                  className={`${categoryColors[category]} rounded-xl p-4 text-center border`}
                >
                  <div className="text-2xl mb-2">{categoryIcons[category]}</div>
                  <div className="text-xs font-medium mb-1">{category}</div>
                  <div className="text-lg font-bold">₹{amount.toFixed(2)}</div>
                  <div className="text-xs opacity-75">
                    {((amount / monthTotal) * 100).toFixed(1)}%
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Daily Expenses */}
      {sortedDates.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800">Daily Expenses</h3>
          {sortedDates.map(date => {
            const dayExpenses = dailyExpenses[date];
            const dayTotal = dayExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
            
            return (
              <div key={date} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">📅</span>
                      <div>
                        <div className="font-bold">
                          {new Date(date).toLocaleDateString('en-IN', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="text-sm text-blue-100">
                          {dayExpenses.length} expense{dayExpenses.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">₹{dayTotal.toFixed(2)}</div>
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {dayExpenses.map(exp => (
                    <div key={exp.id} className="p-4 hover:bg-gray-50 transition-colors duration-150">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="text-2xl">
                            {categoryIcons[exp.category]}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">{exp.name}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${categoryColors[exp.category]}`}>
                                {exp.category}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-xl font-bold text-gray-900">
                              ₹{parseFloat(exp.amount).toFixed(2)}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
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
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No expenses this month</h3>
          <p className="text-gray-600">Start adding expenses to track your spending for {monthName}</p>
        </div>
      )}
    </div>
  );
};

export default MonthlyView;