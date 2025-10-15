import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const AddGroupModal = ({ showForm, setShowForm, onGroupAdded }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddGroup = async (e) => {
    e.preventDefault();

    if (!groupName || !members) {
      toast.error("Please fill in all fields");
      return;
    }

    const memberCount = parseInt(members);
    if (memberCount < 2) {
      toast.error("Group must have at least 2 members");
      return;
    }

    if (memberCount > 20) {
      toast.error("Group cannot have more than 20 members");
      return;
    }

    setLoading(true);

    try {
      // Insert the group
      const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .insert([
          {
            name: groupName,
            created_by: user.id,
            member_count: memberCount,
          }
        ])
        .select()
        .single();

      if (groupError) {
        if (groupError.code === '23505') {
          toast.error('A group with this name already exists');
        } else {
          throw groupError;
        }
        return;
      }

      toast.success("Group created successfully!");
      setGroupName("");
      setMembers("");
      setShowForm(false);
      
      if (onGroupAdded) {
        onGroupAdded();
      }

      // Navigate to the group page
      navigate(`/group/${groupData.id}`, { 
        state: { 
          group: groupData,
          isNew: true 
        } 
      });
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error('Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  if (!showForm) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">Create New Group</h3>
            <button
              onClick={() => {
                setShowForm(false);
                setGroupName("");
                setMembers("");
              }}
              className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200"
            >
              <span className="text-xl">✖️</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleAddGroup} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Group Name
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g., Weekend Trip, Roommates"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Members
            </label>
            <input
              type="number"
              value={members}
              onChange={(e) => setMembers(e.target.value)}
              placeholder="Enter number (2-20)"
              min="2"
              max="20"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              You can add member names after creating the group
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setGroupName("");
                setMembers("");
              }}
              disabled={loading}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-medium transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? "Creating..." : "Create Group"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGroupModal;