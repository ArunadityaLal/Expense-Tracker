import { useEffect, useState } from "react";
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
          `https://expense-tracker-7880f-default-rtdb.firebaseio.com/${uid}/split-smart.json`,
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
        `https://expense-tracker-7880f-default-rtdb.firebaseio.com/${uid}/split-smart/${name}.json`,
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

  const getGroupColor = (index) => {
    const colors = [
      'from-blue-500 to-purple-600',
      'from-green-500 to-teal-600',
      'from-orange-500 to-red-600',
      'from-pink-500 to-rose-600',
      'from-indigo-500 to-blue-600',
      'from-purple-500 to-pink-600'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-20">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 shadow-lg">
            <span className="text-3xl">👥</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            My Groups
          </h1>
          <p className="text-gray-600 text-lg">Manage and track group expenses effortlessly</p>
        </div>

        {/* Search and Controls */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search groups..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <FiSearch className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="ml-6">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white">
                <div className="text-2xl font-bold">{groups.length}</div>
                <div className="text-sm text-blue-100">Total Groups</div>
              </div>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {groups.length === 0 && !showForm && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
              <span className="text-4xl text-gray-400">👥</span>
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">No groups yet</h3>
            <p className="text-gray-600 mb-8">Create your first group to start tracking shared expenses</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Create First Group
            </button>
          </div>
        )}

        {/* Groups Grid */}
        {filteredGroups.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group, index) => (
              <div
                key={group.name}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden group hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/group/${group.name}`, { state: group })}
              >
                {/* Card Header */}
                <div className={`bg-gradient-to-r ${getGroupColor(index)} h-2`}></div>
                
                {/* Card Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`flex items-center justify-center w-16 h-16 bg-gradient-to-r ${getGroupColor(index)} rounded-xl text-white font-bold text-xl shadow-lg`}>
                      {group.name[0].toUpperCase()}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteGroup(group.name);
                      }}
                      className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all duration-200"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                      {group.name}
                    </h2>
                    <div className="flex items-center text-gray-600">
                      <span className="text-sm">👤</span>
                      <span className="ml-2 text-sm font-medium">{group.members} members</span>
                    </div>
                  </div>
                  
                  {/* Quick stats */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Status</span>
                      <span className="text-green-600 font-medium">Active</span>
                    </div>
                  </div>
                </div>
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-600/0 group-hover:from-blue-500/10 group-hover:to-purple-600/10 transition-all duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>
        )}

        <AddGroupModal
          showForm={showForm}
          setShowForm={setShowForm}
          setGroups={setGroups}
        />

        {/* Floating Action Button */}
        <button
          onClick={() => setShowForm(true)}
          className="fixed bottom-8 right-8 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-2xl hover:from-blue-600 hover:to-purple-700 transform hover:scale-110 transition-all duration-200"
        >
          <span className="text-2xl font-light">+</span>
        </button>
      </div>
    </div>
  );
};

export default Groups;