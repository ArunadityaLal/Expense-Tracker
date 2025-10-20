import { useState } from "react";
import { TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react";

const AnalyticsView = ({ expenses, categories }) => {
  const [chartType, setChartType] = useState("category"); // category or monthly

  const categoryColors = {
    Food: { bg: "bg-orange-500", light: "bg-orange-100", text: "text-orange-800" },
    Transport: { bg: "bg-blue-500", light: "bg-blue-100", text: "text-blue-800" },
    Utilities: { bg: "bg-green-500", light: "bg-green-100", text: "text-green-800" },
    Entertainment: { bg: "bg-purple-500", light: "bg-purple-100", text: "text-purple-800" },
    Shopping: { bg: "bg-pink-500", light: "bg-pink-100", text: "text-pink-800" },
    Healthcare: { bg: "bg-red-500", light: "bg-red-100", text: "text-red-800" },
    Education: { bg: "bg-indigo-500", light: "bg-indigo-100", text: "text-indigo-800" },
    Others: { bg: "bg-gray-500", light: "bg-gray-100", text: "text-gray-800" },
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

  // Calculate category totals
  const categoryTotals = expenses.reduce((acc, exp) => {
    if (!acc[exp.category]) {
      acc[exp.category] = { total: 0, count: 0 };
    }
    acc[exp.category].total += parseFloat(exp.amount);
    acc[exp.category].count += 1;
    return acc;
  }, {});

  const totalAmount = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1].total - a[1].total);

  // Calculate monthly totals for the last 6 months
  const last6Months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    last6Months.push({
      month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      fullDate: date,
      total: 0,
      count: 0
    });
  }

  expenses.forEach(exp => {
    const expDate = new Date(exp.date);
    const monthIndex = last6Months.findIndex(m => 
      m.fullDate.getMonth() === expDate.getMonth() && 
      m.fullDate.getFullYear() === expDate.getFullYear()
    );
    if (monthIndex !== -1) {
      last6Months[monthIndex].total += parseFloat(exp.amount);
      last6Months[monthIndex].count += 1;
    }
  });

  const maxMonthlyAmount = Math.max(...last6Months.map(m => m.total), 1);

  // Calculate insights
  const avgExpenseAmount = expenses.length > 0 ? totalAmount / expenses.length : 0;
  const thisMonth = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
  });
  const lastMonth = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return expDate.getMonth() === lastMonthDate.getMonth() && expDate.getFullYear() === lastMonthDate.getFullYear();
  });
  
  const thisMonthTotal = thisMonth.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  const lastMonthTotal = lastMonth.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  const monthlyChange = lastMonthTotal > 0 ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 : 0;

  const topCategory = sortedCategories[0];
  const topCategoryName = topCategory ? topCategory[0] : 'N/A';
  const topCategoryAmount = topCategory ? topCategory[1].total : 0;
  const topCategoryPercentage = totalAmount > 0 ? (topCategoryAmount / totalAmount) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${categoryColors[topCategoryName]?.light || 'bg-gray-100'}`}>
              <span className="text-2xl">{categoryIcons[topCategoryName] || '📊'}</span>
            </div>
            <DollarSign className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-sm font-medium text-blue-800 mb-1">Top Category</h3>
          <div className="text-2xl font-bold text-blue-900">{topCategoryName}</div>
          <div className="text-sm text-blue-700 mt-1">
            ₹{topCategoryAmount.toFixed(2)} ({topCategoryPercentage.toFixed(1)}%)
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-200 rounded-xl">
              <span className="text-2xl">💰</span>
            </div>
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-sm font-medium text-green-800 mb-1">Average Expense</h3>
          <div className="text-2xl font-bold text-green-900">₹{avgExpenseAmount.toFixed(2)}</div>
          <div className="text-sm text-green-700 mt-1">
            Per transaction
          </div>
        </div>

        <div className={`bg-gradient-to-br ${monthlyChange >= 0 ? 'from-red-50 to-red-100' : 'from-green-50 to-green-100'} rounded-2xl p-6 border ${monthlyChange >= 0 ? 'border-red-200' : 'border-green-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 ${monthlyChange >= 0 ? 'bg-red-200' : 'bg-green-200'} rounded-xl`}>
              <span className="text-2xl">📈</span>
            </div>
            {monthlyChange >= 0 ? (
              <TrendingUp className="w-6 h-6 text-red-600" />
            ) : (
              <TrendingDown className="w-6 h-6 text-green-600" />
            )}
          </div>
          <h3 className={`text-sm font-medium ${monthlyChange >= 0 ? 'text-red-800' : 'text-green-800'} mb-1`}>
            Monthly Change
          </h3>
          <div className={`text-2xl font-bold ${monthlyChange >= 0 ? 'text-red-900' : 'text-green-900'}`}>
            {monthlyChange >= 0 ? '+' : ''}{monthlyChange.toFixed(1)}%
          </div>
          <div className={`text-sm ${monthlyChange >= 0 ? 'text-red-700' : 'text-green-700'} mt-1`}>
            vs last month
          </div>
        </div>
      </div>

      {/* Chart Type Selector */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setChartType("category")}
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
            chartType === "category"
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
              : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
          }`}
        >
          Category Breakdown
        </button>
        <button
          onClick={() => setChartType("monthly")}
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
            chartType === "monthly"
              ? "bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-lg"
              : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
          }`}
        >
          Monthly Trend
        </button>
      </div>

      {/* Charts */}
      {chartType === "category" ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Spending by Category</h3>
          
          {sortedCategories.length > 0 ? (
            <div className="space-y-4">
              {sortedCategories.map(([category, data]) => {
                const percentage = (data.total / totalAmount) * 100;
                const color = categoryColors[category];
                
                return (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{categoryIcons[category]}</span>
                        <span className="font-semibold text-gray-800">{category}</span>
                        <span className="text-sm text-gray-500">({data.count} expenses)</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">₹{data.total.toFixed(2)}</div>
                        <div className="text-sm text-gray-600">{percentage.toFixed(1)}%</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`${color.bg} h-full rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-gray-600">No data to display</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Last 6 Months Spending</h3>
          
          <div className="space-y-4">
            {last6Months.map((month, index) => {
              const heightPercentage = (month.total / maxMonthlyAmount) * 100;
              const isCurrentMonth = month.fullDate.getMonth() === now.getMonth() && 
                                    month.fullDate.getFullYear() === now.getFullYear();
              
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <span className={`font-semibold ${isCurrentMonth ? 'text-green-600' : 'text-gray-800'}`}>
                        {month.month}
                        {isCurrentMonth && ' (Current)'}
                      </span>
                      <span className="text-sm text-gray-500">({month.count} expenses)</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">₹{month.total.toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                      className={`${isCurrentMonth ? 'bg-gradient-to-r from-green-500 to-teal-600' : 'bg-gradient-to-r from-blue-500 to-purple-600'} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${heightPercentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-xl">🏆</span>
            Top 3 Categories
          </h3>
          <div className="space-y-3">
            {sortedCategories.slice(0, 3).map(([category, data], index) => {
              const color = categoryColors[category];
              return (
                <div key={category} className={`${color.light} rounded-xl p-4 border ${color.bg.replace('bg-', 'border-')}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 ${color.bg} rounded-lg flex items-center justify-center text-white font-bold`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{categoryIcons[category]}</span>
                          <span className={`font-semibold ${color.text}`}>{category}</span>
                        </div>
                        <div className="text-xs text-gray-600">{data.count} transactions</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${color.text}`}>₹{data.total.toFixed(2)}</div>
                      <div className="text-xs text-gray-600">
                        {((data.total / totalAmount) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-xl">💡</span>
            Quick Stats
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
              <span className="text-gray-700">Total Expenses</span>
              <span className="font-bold text-blue-900">{expenses.length}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
              <span className="text-gray-700">Categories Used</span>
              <span className="font-bold text-green-900">{Object.keys(categoryTotals).length}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
              <span className="text-gray-700">This Month</span>
              <span className="font-bold text-purple-900">{thisMonth.length}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl">
              <span className="text-gray-700">Highest Single</span>
              <span className="font-bold text-orange-900">
                ₹{expenses.length > 0 ? Math.max(...expenses.map(e => parseFloat(e.amount))).toFixed(2) : '0.00'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;