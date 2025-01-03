import React, { useEffect, useState } from "react";
import { FiSearch, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import AddGroupModal from "../modals/AddGroupModal";

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const getGrpExpense = async () => {
      const uidString = localStorage.getItem("tokenId");
      if (!uidString) {
        console.error("User token not found.");
        return;
      }

      const uid = JSON.parse(uidString);

      try {
        const response = await fetch(
          `https://expense-tracker-204b0-default-rtdb.firebaseio.com/${uid}/split-smart.json`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch group expenses");
        }

        const data = await response.json();
        const grp = [];
         
        for (const key in data) {
          const value = data[key];
          for (const subKey in value) {
           if(value[subKey].members !== undefined){
            const item = value[subKey].members;
            grp.push({ name: key, members: item });
           }
          }
        }

        setGroups(grp);
      } catch (error) {
        console.error("Error fetching group expenses:", error);
      }
    };
    getGrpExpense();
  }, []);

  const deleteGroup = async (name) => {
    const uidString = localStorage.getItem("tokenId");
    if (!uidString) {
      console.error("User token not found.");
      return;
    }

    const uid = JSON.parse(uidString);

    try {
      const response = await fetch(
        `https://expense-tracker-204b0-default-rtdb.firebaseio.com/${uid}/split-smart/${name}.json`,
        { method: "DELETE" },
      );

      if (!response.ok) {
        throw new Error("Failed to delete group");
      }

      setGroups((prevGroups) =>
        prevGroups.filter((group) => group.name !== name),
      );
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-50 p-20">
      <div className="mb-6 flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold">Groups</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded border border-gray-300 p-2 pl-8"
          />
          <FiSearch className="absolute left-2 top-3 h-5 w-5 text-gray-500" />
        </div>
      </div>

      {groups.length === 0 && !showForm && (
        <div className="flex flex-grow items-center justify-center">
          <p className="text-lg text-gray-400">No groups created yet</p>
        </div>
      )}

      <div className="w-full space-y-4">
        {filteredGroups.map((group) => (
          <div
            key={group.name}
            className="flex cursor-pointer items-center justify-between rounded-lg bg-white p-4 shadow-sm"
            onClick={() => navigate(`/group/${group.name}`, { state: group })}
          >
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-200 font-bold text-white">
                {group.name[0]}
              </div>
              <div>
                <h2 className="text-lg font-semibold">{group.name}</h2>
                <p className="text-sm text-gray-500">{group.members} members</p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteGroup(group.name);
              }}
              className="text-red-500 hover:text-red-700"
            >
              <FiTrash2 className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>

      <AddGroupModal
        showForm={showForm}
        setShowForm={setShowForm}
        setGroups={setGroups}
      />

      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-8 right-8 flex h-14 w-14 items-center justify-center rounded-full bg-black text-2xl text-white shadow-lg"
      >
        +
      </button>
    </div>
  );
};

export default Groups;
