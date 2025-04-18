import React, { useState } from "react";
import Car_verification from "./Car_verification";

const users = [
  { id: "U001", name: "John Doe", date: "2025-04-18" },
  { id: "U002", name: "Jane Smith", date: "2025-04-17" },
  { id: "U003", name: "Mike Johnson", date: "2025-04-16" },
];

export default function User_verification() {
  const [activeTab, setActiveTab] = useState("userList");
  const [selectedUser, setSelectedUser] = useState(null);
  const [license, setLicense] = useState(null);
  const [passport, setPassport] = useState(null);

  const handleFileChange = (setter) => (event) => {
    setter(event.target.files[0]);
  };

  const handleSubmit = () => {
    if (license && passport) {
      alert("Documents submitted successfully!");
      setSelectedUser(null);
      setLicense(null);
      setPassport(null);
    } else {
      alert("Please upload both documents.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100" style={{ backgroundImage: "url('/Images/car-bg.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
      {/* Navbar */}
      <nav className="flex items-center justify-between bg-emerald-500 text-white px-6 py-4 shadow-lg fixed w-full z-10 top-0">
        <div className="text-3xl font-bold">CARZY</div>
        <div className="space-x-6">
          <button
            onClick={() => setActiveTab("userList")}
            className={`hover:text-gray-600 transition duration-200 ${activeTab === "userList" ? "underline" : ""
              }`}
          >
            User Verification
          </button>
          <button
            onClick={() => setActiveTab("carList")}
            className={`hover:text-gray-600 transition duration-200 ${activeTab === "carList" ? "underline" : ""
              }`}
          >
            Car Verification
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-24 p-6">
        {activeTab === "userList" && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold mb-6 text-center text-white">User List</h2>
            <div className="space-y-6">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-6 bg-white shadow-lg rounded-lg transition duration-300 hover:shadow-2xl"
                >
                  <div className="flex items-center gap-6">
                    <div className="text-xl font-semibold text-emerald-700">{user.name}</div>
                    <div className="text-sm text-gray-600">ID: {user.id}</div>
                    <div className="text-sm text-gray-500">Date: {user.date}</div>
                  </div>
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-3 rounded-lg transition duration-300"
                  >
                    Open
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "carList" && (
          // <div className="text-center text-lg text-white bg-black bg-opacity-50 p-4 rounded-lg">
          //   Car verification list will appear here.
          // </div>
             <Car_verification/>
        )}
      </div>

      {/* Modal with transparent overlay */}
      {selectedUser && (
        <div className="fixed inset-0 z-20 flex justify-center items-center pointer-events-none">
          {/* Semi-transparent overlay */}
          <div className="absolute inset-0 bg-black opacity-50 pointer-events-auto"></div>

          {/* Modal content */}
          <div className="bg-white rounded-lg p-8 shadow-2xl max-w-md w-full z-30 pointer-events-auto">
            <h3 className="text-emerald-700 text-2xl font-semibold mb-6">
              Upload Documents for {selectedUser.name}
            </h3>

            <div className="mb-6">
              <label className="block text-emerald-700 font-medium mb-2">License Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange(setLicense)}
                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-emerald-500 file:text-white hover:file:bg-emerald-600"
              />
            </div>

            <div className="mb-6">
              <label className="block text-emerald-700 font-medium mb-2">Passport Size Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange(setPassport)}
                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-emerald-500 file:text-white hover:file:bg-emerald-600"
              />
            </div>

            <div className="flex justify-end gap-6">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-5 py-3 rounded-lg text-emerald-700 border border-emerald-700 hover:bg-emerald-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-5 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}