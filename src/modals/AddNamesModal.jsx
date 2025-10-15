import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const AddNamesModal = ({ groupId, memberCount, existingNames, closeModal, onNamesUpdated }) => {
  const [memberNames, setMemberNames] = useState(
    existingNames.length > 0 
      ? existingNames 
      : Array(memberCount).fill("")
  );
  const [loading, setLoading] = useState(false);

  const handleInputChange = (index, value) => {
    const updatedNames = [...memberNames];
    updatedNames[index] = value;
    setMemberNames(updatedNames);
  };

  const handleSave = async () => {
    // Validate all names are filled
    if (memberNames.some(name => !name.trim())) {
      toast.error("Please fill in all member names");
      return;
    }

    // Check for duplicates
    const uniqueNames = new Set(memberNames.map(n => n.trim().toLowerCase()));
    if (uniqueNames.size !== memberNames.length) {
      toast.error("Member names must be unique");
      return;
    }

    setLoading(true);

    try {
      // Delete existing members
      await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId);

      // Insert new members
      const membersData = memberNames.map((name, index) => ({
        group_id: groupId,
        name: name.trim(),
        position: index,
      }));

      const { error } = await supabase
        .from('group_members')
        .insert(membersData);

      if (error) throw error;

      toast.success("Member names saved successfully!");
      if (onNamesUpdated) {
        onNamesUpdated();
      }
      closeModal();
    } catch (error) {
      console.error('Error saving member names:', error);
      toast.error('Failed to save member names');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">Group Members</h1>
        </div>

        <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
          {memberNames.map((name, index) => (
            <div key={index} className="flex items-center space-x-4">
              <span className="font-semibold text-gray-700 w-8">{index + 1}.</span>
              <input
                type="text"
                placeholder={`Member ${index + 1}`}
                value={name}
                onChange={(e) => handleInputChange(index, e.target.value)}
                className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                disabled={loading}
              />
            </div>
          ))}
        </div>

        <div className="flex gap-3 p-6 border-t border-gray-100">
          <button
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all duration-200"
            onClick={closeModal}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-medium py-3 px-4 rounded-xl transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Members"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNamesModal;