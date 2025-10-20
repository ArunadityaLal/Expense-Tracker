import { useState } from "react";
import { X, Settings, LogOut, Key, Trash2, AlertTriangle, Loader } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const SettingsModal = ({ isOpen, onClose }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("logout"); // logout, password, delete

  // Password change state
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Delete account state
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully!");
      onClose();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      toast.error("New password must be different from current password");
      return;
    }

    setPasswordLoading(true);

    try {
      // Verify current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: passwordData.currentPassword,
      });

      if (signInError) {
        toast.error("Current password is incorrect");
        setPasswordLoading(false);
        return;
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (updateError) throw updateError;

      toast.success("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      
      // Close modal after successful password change
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Password change error:", error);
      toast.error("Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE") {
      toast.error('Please type "DELETE" to confirm');
      return;
    }

    setDeleteLoading(true);

    try {
      // Delete user's data from profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);

      if (profileError) console.error('Profile deletion error:', profileError);

      // Delete user's personal expenses
      const { error: expensesError } = await supabase
        .from('personal_expenses')
        .delete()
        .eq('user_id', user.id);

      if (expensesError) console.error('Expenses deletion error:', expensesError);

      // Delete user's groups
      const { error: groupsError } = await supabase
        .from('groups')
        .delete()
        .eq('created_by', user.id);

      if (groupsError) console.error('Groups deletion error:', groupsError);

      // Delete the user account
      // Note: This requires admin privileges or a server-side function
      // For now, we'll sign out the user
      toast.success("Account data deleted. Please contact support to complete account deletion.");
      
      await signOut();
      onClose();
      navigate("/");
    } catch (error) {
      console.error("Account deletion error:", error);
      toast.error("Failed to delete account");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-end items-start z-50 p-4 pt-18 pr-4">


      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-slideDown">

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <Settings className="w-6 h-6" />
              Settings
            </h3>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("logout")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-all duration-200 ${
              activeTab === "logout"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <LogOut className="w-4 h-4 inline mr-2" />
            Logout
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-all duration-200 ${
              activeTab === "password"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Key className="w-4 h-4 inline mr-2" />
            Password
          </button>
          <button
            onClick={() => setActiveTab("delete")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-all duration-200 ${
              activeTab === "delete"
                ? "border-b-2 border-red-500 text-red-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Trash2 className="w-4 h-4 inline mr-2" />
            Delete
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Logout Tab */}
          {activeTab === "logout" && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LogOut className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Logout from TrackTally?</h3>
                <p className="text-gray-600">
                  You can always log back in anytime with your credentials.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Your data will be saved and available when you log back in.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-6 rounded-xl font-medium transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </div>
          )}

          {/* Change Password Tab */}
          {activeTab === "password" && (
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Key className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Change Password</h3>
                <p className="text-gray-600 text-sm">
                  Enter your current password and choose a new one.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                  disabled={passwordLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Enter new password (min 6 characters)"
                  disabled={passwordLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                  required
                  minLength={6}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                  disabled={passwordLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={passwordLoading}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium transition-all duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-medium transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {passwordLoading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Changing...
                    </>
                  ) : (
                    <>
                      <Key className="w-5 h-5" />
                      Change Password
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Delete Account Tab */}
          {activeTab === "delete" && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Account</h3>
                <p className="text-gray-600 text-sm">
                  This action cannot be undone. All your data will be permanently deleted.
                </p>
              </div>

              {!showDeleteWarning ? (
                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <h4 className="font-semibold text-red-800 mb-2">⚠️ Warning</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• All your personal expenses will be deleted</li>
                      <li>• All your groups and group expenses will be deleted</li>
                      <li>• Your profile and account data will be removed</li>
                      <li>• This action is permanent and cannot be reversed</li>
                    </ul>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={onClose}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setShowDeleteWarning(true)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <p className="text-sm text-yellow-800">
                      To confirm deletion, please type <strong>DELETE</strong> in the box below:
                    </p>
                  </div>

                  <input
                    type="text"
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    placeholder='Type "DELETE" to confirm'
                    disabled={deleteLoading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                  />

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowDeleteWarning(false);
                        setDeleteConfirmation("");
                      }}
                      disabled={deleteLoading}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium transition-all duration-200 disabled:opacity-50"
                    >
                      Go Back
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      disabled={deleteLoading || deleteConfirmation !== "DELETE"}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {deleteLoading ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-5 h-5" />
                          Delete Account
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;