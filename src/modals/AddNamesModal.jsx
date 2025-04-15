import React, { useState,useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AddNamesModal = ({setAddNames, groupName , onSaveSuccess}) => {
  const { state } = useLocation();
  const { name, members } = state;
  const navigate = useNavigate();

  const [memberNames, setMemberNames] = useState(Array(members).fill(""));
  const [showModal, setShowModal] = useState(true); 

  const handleInputChange = (index, value) => {
    const updatedNames = [...memberNames];
    updatedNames[index] = value;
    setMemberNames(updatedNames);
  };
  
  useEffect(()=>{
    const fetchNames = async () => {
      const uidString = localStorage.getItem("tokenId");
      if (!uidString) {
        console.error("User token not found.");
        return;
      }

      const uid = JSON.parse(uidString);

      try {
        const response = await fetch(
          `https://expense-tracker-204b0-default-rtdb.firebaseio.com/${uid}/split-smart/${groupName}.json`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch expenses");
        }

        const data = await response.json();
        
        if (data.names) {
          setMemberNames(data.names);
          console.log(data.names);
        } 
        else{
          setMemberNames(Array(members).fill(""));
        }
      }  catch (error) {
        console.error("Error fetching names:", error);
      }
    }     
    fetchNames();
  },[groupName,members])
       
  const handleEnter = async () => {
    try {
      const uidString = localStorage.getItem("tokenId");
      const uid = JSON.parse(uidString);

      await fetch(
        `https://expense-tracker-204b0-default-rtdb.firebaseio.com/${uid}/split-smart/${groupName}/names.json`,
        {
          method: "POST",
          body: JSON.stringify(memberNames),
        }
      );
    } catch (error) {
      console.error("Error adding names:", error);
    }
    if (memberNames.every(name => name !== "")) {
      navigate(`/group/${groupName}`, { state: { name, members, memberNames } });
      setAddNames(false); 
      onSaveSuccess();
    } else {
      alert("Please fill in all member names.");
    }

  };

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-96 space-y-6">
            <h1 className="text-3xl font-bold text-center">{name} - Members</h1>

            <div className="space-y-4">
              {memberNames.map((_, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <span className="font-semibold">{index + 1}.</span>
                  <input
                    type="text"
                    placeholder={`Member ${index + 1}`}
                    value={memberNames[index]}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleEnter}
              >
                Enter
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setShowModal(false)} 
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddNamesModal;
