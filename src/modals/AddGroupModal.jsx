import React, { useState } from 'react';

const AddGroupModal = ({ showForm, setShowForm ,setGroups}) => {
  const [newGroup, setNewGroup] = useState({ name: '', members: '' });

  const handleAddGroup = async () => {
    if (!newGroup.name.trim() || isNaN(newGroup.members) || newGroup.members <= 0) {
      alert("Please enter valid group details.");
      return;
    }

    const uidString = localStorage.getItem("tokenId");
    if (!uidString) {
      console.error("User token not found.");
      return;
    }

    const uid = JSON.parse(uidString);

    try {
      const response = await fetch(
        `https://expense-tracker-204b0-default-rtdb.firebaseio.com/${uid}/split-smart/${newGroup.name}.json`,
        {
          method: "POST",
          body: JSON.stringify({ members: newGroup.members }),
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add group");
      }

      setGroups((prevGroups) => [
        ...prevGroups,
        {
          name: newGroup.name,
          members: newGroup.members,
        },
      ]);

      setNewGroup({ name: "", members: "" });
      setShowForm(false);
    } catch (error) {
      console.error("Error adding group:", error);
    }
  };

  if (!showForm) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">Add New Group</h2>
          <button
            onClick={() => setShowForm(false)}
            className="text-gray-600 hover:text-gray-900 font-bold"
          >
            ✖️
          </button>
        </div>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Group Name"
            value={newGroup.name}
            onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="number"
            placeholder="Number of Members"
            value={newGroup.members}
            onChange={(e) =>
              setNewGroup({ ...newGroup, members: Number(e.target.value) })
            }
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleAddGroup}
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
          >
            Add Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddGroupModal;