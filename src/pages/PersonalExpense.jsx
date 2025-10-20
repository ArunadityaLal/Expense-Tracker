import { useEffect, useState } from "react";
import { PlusCircle, TrendingUp, Calendar, BarChart3 } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import AllExpensesView from "../components/expense/AllExpensesView";
import MonthlyView from "../components/expense/MonthlyView";
import AnalyticsView from "../components/expense/AnalyticsView";
import AddExpenseModal from "../components/expense/AddExpenseModal";

const PersonalExpense = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all"); // all, monthly, analytics
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const categories = [
    "Food",
    "Transport", 
    "Utilities",
    "Entertainment",
    "Shopping",
    "Healthcare",
    "Education",
    "Others",
  ];

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

  const handleAddExpense = async (formData) => {
    try {
      const { data, error } = await supabase
        .from('personal_expenses')
        .insert([
          {
            user_id: user.id,
            name: formData.name,
            amount: parseFloat(formData.amount),
            category: formData.category,
            date: formData.date,
          }
        ])
        .select();

      if (error) throw error;

      setExpenses([data[0], ...expenses]);
      toast.success("Expense added successfully!");
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('Failed to add expense');
    }
  };

  const handleUpdateExpense = async (id, formData) => {
    try {
      const { error } = await supabase
        .from('personal_expenses')
        .update({
          name: formData.name,
          amount: parseFloat(formData.amount),
          category: formData.category,
          date: formData.date,
        })
        .eq('id', id);

      if (error) throw error;

      setExpenses(expenses.map(exp => 
        exp.id === id 
          ? { ...exp, ...formData, amount: parseFloat(formData.amount) }
          : exp
      ));
      
      toast.success("Expense updated successfully!");
      setEditingExpense(null);
    } catch (error) {
      console.error('Error updating expense:', error);
      toast.error('Failed to update expense');
    }
  };

  const handleDeleteExpense = async (id) => {
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

  const totalAmount = expenses.reduce(
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 px-4">
      <div className="mx-auto max-w-7xl py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Finance</h1>
          <p className="text-gray-600">Track your expenses and manage your budget efficiently</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-2"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Total Spent</span>
                <span className="text-2xl">💰</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">₹{totalAmount.toFixed(2)}</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Total Expenses</span>
                <span className="text-2xl">📊</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{expenses.length}</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 h-2"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">This Month</span>
                <span className="text-2xl">📅</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                ₹{expenses.filter(exp => {
                  const expDate = new Date(exp.date);
                  const now = new Date();
                  return expDate.getMonth() === now.getMonth() && 
                         expDate.getFullYear() === now.getFullYear();
                }).reduce((sum, exp) => sum + parseFloat(exp.amount), 0).toFixed(2)}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 h-2"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Categories</span>
                <span className="text-2xl">🏷️</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {new Set(expenses.map(exp => exp.category)).size}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("all")}
              className={`flex-1 py-4 px-6 font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === "all"
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <PlusCircle className="w-5 h-5" />
              All Expenses
            </button>
            <button
              onClick={() => setActiveTab("monthly")}
              className={`flex-1 py-4 px-6 font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === "monthly"
                  ? "bg-gradient-to-r from-green-500 to-teal-600 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Calendar className="w-5 h-5" />
              Monthly View
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`flex-1 py-4 px-6 font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === "analytics"
                  ? "bg-gradient-to-r from-orange-500 to-red-600 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              Analytics
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "all" && (
              <AllExpensesView
                expenses={expenses}
                categories={categories}
                onEdit={setEditingExpense}
                onDelete={handleDeleteExpense}
              />
            )}
            {activeTab === "monthly" && (
              <MonthlyView
                expenses={expenses}
                categories={categories}
                onEdit={setEditingExpense}
                onDelete={handleDeleteExpense}
              />
            )}
            {activeTab === "analytics" && (
              <AnalyticsView
                expenses={expenses}
                categories={categories}
              />
            )}
          </div>
        </div>

        {/* Floating Action Button */}
        <button
          onClick={() => {
            setEditingExpense(null);
            setShowAddModal(true);
          }}
          className="fixed bottom-8 right-8 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-2xl hover:from-blue-600 hover:to-purple-700 transform hover:scale-110 transition-all duration-200"
          title="Add expense"
        >
          <PlusCircle className="w-8 h-8" />
        </button>

        {/* Add/Edit Expense Modal */}
        {(showAddModal || editingExpense) && (
          <AddExpenseModal
            expense={editingExpense}
            categories={categories}
            onSave={editingExpense ? handleUpdateExpense : handleAddExpense}
            onClose={() => {
              setShowAddModal(false);
              setEditingExpense(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default PersonalExpense;