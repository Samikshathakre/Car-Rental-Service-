// export default function AdminNavbar() {
//     return (
//         <nav className="bg-gray-800 text-white shadow-md">
//             <div className="max-w-7xl mx-auto px-4">
//                 <div className="flex justify-between items-center h-16">
//                     {/* Crazy Name on Left */}
//                     <div className="flex-shrink-0 flex items-center">
//                         <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
//                             TITAN<span className="text-yellow-400">PULSE</span>
//                         </span>
//                     </div>

//                     {/* Admin and Customer Support on Right */}
//                     <div className="flex items-center space-x-8">
//                         <a href="#admin" className="text-white hover:text-blue-300 transition duration-200 font-medium">
//                             Admin
//                         </a>
//                         <a href="#support" className="text-white hover:text-blue-300 transition duration-200 font-medium">
//                             Customer Support
//                         </a>
//                     </div>
//                 </div>
//             </div>
//         </nav>
//     );
// }
import React, { useState } from "react";

const App = () => {
  const [activeTab, setActiveTab] = useState(null);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const users = [
    { id: 1, date: "2025-04-01" },
    { id: 2, date: "2025-04-05" },
    { id: 3, date: "2025-04-10" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="flex items-center justify-between bg-blue-600 text-white px-6 py-4 shadow-md">
        <div className="text-2xl font-bold">CarRentalLogo</div>
        <div className="space-x-6">
          <button
            onClick={() => handleTabClick("admin")}
            className="hover:text-yellow-300 transition duration-200"
          >
            Admin
          </button>
          <button
            onClick={() => handleTabClick("user")}
            className="hover:text-yellow-300 transition duration-200"
          >
            User
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className="p-6">
        {activeTab === "admin" && (
          <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">User List</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-200 text-left text-gray-700">
                    <th className="px-4 py-2">User ID</th>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="bg-gray-50 border-b">
                      <td className="px-4 py-2">{user.id}</td>
                      <td className="px-4 py-2">{user.date}</td>
                      <td className="px-4 py-2">
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                          Check
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;

