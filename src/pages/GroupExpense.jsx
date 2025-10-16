import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import AddExpenseModal from "../modals/AddExpenseModal";
import { FiTrash2 } from "react-icons/fi";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { TiUserAdd } from "react-icons/ti";
import SettleUpModal from "../modals/SettleUpModal";
import AddNamesModal from "../modals/AddNamesModal";

const GroupExpense = () => {
  const { user } = useAuth();
  const { state } = useLocation();
  const { name: groupId } = useParams();
  
  const [group, setGroup] = useState(state?.group || null);
  const [memberNames, setMemberNames] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showSettleUp, setShowSettleUp] = useState(false);
  const [groupExpenses, setGroupExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addNames, setAddNames] = useState(false);

  useEffect(() => {
    if (!group && groupId) {
      fetchGroup();
    }
  }, [groupId]);

  useEffect(() => {
    if (group) {
      fetchMemberNames();
      fetchGroupExpenses();
    }
  }, [group]);

  const fetchGroup = async () => {
    try {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .eq('id', groupId)
        .single();

      if (error) throw error;
      setGroup(data);
    } catch (error) {
      console.error('Error fetching group:', error);
      toast.error('Failed to load group');
    }
  };

  const fetchMemberNames = async () => {
    try {
      const { data, error } = await supabase
        .from('group_members')
        .select('*')
        .eq('group_id', group.id)
        .order('position', { ascending: true });

      if (error) throw error;

      setMemberNames(data?.map(m => m.name) || []);
    } catch (error) {
      console.error('Error fetching member names:', error);
    }
  };

  const fetchGroupExpenses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('group_expenses')
        .select('*')
        .eq('group_id', group.id)
        .order('date', { ascending: false });

      if (error) throw error;

      setGroupExpenses(data || []);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpense = async (expenseId, expenseName) => {
    if (!window.confirm(`Are you sure you want to delete "${expenseName}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('group_expenses')
        .delete()
        .eq('id', expenseId);

      if (error) throw error;

      setGroupExpenses(groupExpenses.filter(exp => exp.id !== expenseId));
      toast.success('Expense deleted successfully!');
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Failed to delete expense');
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const { error } = await supabase
        .from('groups')
        .update({ status: newStatus })
        .eq('id', group.id);

      if (error) throw error;

      setGroup({ ...group, status: newStatus });
      
      if (newStatus === 'completed') {
        toast.success('Group marked as completed! 🎉');
      } else if (newStatus === 'cancelled') {
        toast.success('Group cancelled');
      } else {
        toast.success('Group reactivated!');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const totalAmount = groupExpenses.reduce((total, expense) => total + parseFloat(expense.amount || 0), 0);

  // Status badge styling
  const getStatusBadge = (status) => {
    const styles = {
      active: {
        bg: 'bg-green-100',
        text: 'text-green-700',
        border: 'border-green-300',
        icon: '✓'
      },
      completed: {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        border: 'border-blue-300',
        icon: '✓'
      },
      cancelled: {
        bg: 'bg-red-100',
        text: 'text-red-700',
        border: 'border-red-300',
        icon: '✗'
      }
    };
    
    return styles[status] || styles.active;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-20 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg text-gray-600">Loading group...</p>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Group not found</h2>
          <p className="text-gray-600">The group you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const currentStatus = group.status || 'active';
  const statusBadge = getStatusBadge(currentStatus);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-20">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-teal-600 rounded-full mb-6 shadow-lg">
            <span className="text-3xl">👥</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-4">
            {group.name}
          </h1>
          <p className="text-gray-600 text-lg mb-4">Track and manage group expenses</p>
          
          {/* Status Toggle Section */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <span className="text-sm font-medium text-gray-600">Status:</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleStatusChange('active')}
                disabled={currentStatus === 'active'}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 transform hover:scale-105 border-2 ${
                  currentStatus === 'active'
                    ? 'bg-green-100 text-green-700 border-green-300 cursor-default'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {currentStatus === 'active' && '✓ '} Active
              </button>
              <button
                onClick={() => handleStatusChange('completed')}
                disabled={currentStatus === 'completed'}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 transform hover:scale-105 border-2 ${
                  currentStatus === 'completed'
                    ? 'bg-blue-100 text-blue-700 border-blue-300 cursor-default'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {currentStatus === 'completed' && '✓ '} Completed
              </button>
              <button
                onClick={() => handleStatusChange('cancelled')}
                disabled={currentStatus === 'cancelled'}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 transform hover:scale-105 border-2 ${
                  currentStatus === 'cancelled'
                    ? 'bg-red-100 text-red-700 border-red-300 cursor-default'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {currentStatus === 'cancelled' && '✗ '} Cancelled
              </button>
            </div>
          </div>
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
              <div className="text-3xl font-bold text-gray-800">{memberNames.length || group.member_count}</div>
              <div className="text-sm text-gray-600 mt-1">Members</div>
            </div>
          </div>
        </div>

        {/* Status Notice for Completed/Cancelled Groups */}
        {(currentStatus === 'completed' || currentStatus === 'cancelled') && (
          <div className={`mb-8 rounded-2xl p-6 border-2 ${
            currentStatus === 'completed' 
              ? 'bg-blue-50 border-blue-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{currentStatus === 'completed' ? '🎉' : '⚠️'}</span>
              <div>
                <h3 className={`font-bold text-lg ${
                  currentStatus === 'completed' ? 'text-blue-800' : 'text-red-800'
                }`}>
                  {currentStatus === 'completed' ? 'Group Completed' : 'Group Cancelled'}
                </h3>
                <p className={currentStatus === 'completed' ? 'text-blue-600' : 'text-red-600'}>
                  {currentStatus === 'completed' 
                    ? 'This group has been marked as completed. You can still view expenses and settlements.'
                    : 'This group has been cancelled. No new expenses can be added.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Expenses List */}
        {groupExpenses.length === 0 ? (
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
            {groupExpenses.map((item) => (
              <div key={item.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-3">
                        <span className="text-white text-xl">💰</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Paid by <span className="font-medium text-blue-600">{item.paid_by}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-800">€{parseFloat(item.amount).toFixed(2)}</div>
                        <div className="text-sm text-gray-500">{item.date}</div>
                      </div>
                      {currentStatus === 'active' && (
                        <button
                          className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all duration-200"
                          onClick={() => handleDeleteExpense(item.id, item.name)}
                          aria-label={`Delete expense ${item.name}`}
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Floating Action Buttons - Only show for active groups */}
        {currentStatus === 'active' && (
          <>
            {groupExpenses.length > 0 && memberNames.length > 0 && (
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
              disabled={memberNames.length === 0}
              className="fixed bottom-8 right-8 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-2xl hover:from-blue-600 hover:to-purple-700 transform hover:scale-110 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title={memberNames.length === 0 ? "Add member names first" : "Add expense"}
            >
              <span className="text-2xl font-light">+</span>
            </button>

            <button
              onClick={() => setAddNames(true)}
              className="fixed bottom-28 right-8 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-xl hover:from-orange-600 hover:to-red-700 transform hover:scale-110 transition-all duration-200"
              title="Manage members"
            >
              <TiUserAdd className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Settle Up Button - Available for all statuses */}
        {currentStatus !== 'active' && groupExpenses.length > 0 && memberNames.length > 0 && (
          <button
            onClick={() => setShowSettleUp(true)}
            className="fixed bottom-8 right-8 flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-green-500 to-teal-600 px-8 py-4 text-white shadow-2xl hover:from-green-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105"
          >
            <FaFileInvoiceDollar className="h-5 w-5" />
            <span className="font-semibold">View Settlement</span>
          </button>
        )}

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
            groupId={group.id}
            memberNames={memberNames}
            closeModal={() => setShowModal(false)}
            onExpenseAdded={fetchGroupExpenses}
          />
        )}

        {addNames && (
          <AddNamesModal
            groupId={group.id}
            memberCount={group.member_count}
            existingNames={memberNames}
            closeModal={() => setAddNames(false)}
            onNamesUpdated={fetchMemberNames}
          />
        )}
      </div>
    </div>
  );
};

export default GroupExpense;