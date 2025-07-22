import { useContext, useEffect, useState } from "react";
import { Shield, User, List, Flag, Edit, Trash2, Home, LogIn, Search, BarChart2, CheckCircle, XCircle, Briefcase } from 'lucide-react';
import ConfirmationModal from "../../ConfirmationModal/ConfirmationModal";
import axios from "axios";
import { StoreContext } from "../../../../context/StoreContext";
import LoaderSpin from "../../../../components/loaderSpin/Loader";



const ManageUsers = ({adminToken}) => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const {url} = useContext(StoreContext)
    const [loading,setLoading] = useState(false)
  

    useEffect(() => { 

      const getUsers = async () => {
        try {
          setLoading(true)
           const response = await axios.get(url+'/api/users/',{
            headers:{
              'Authorization': "Bearer "+adminToken
            }
           }); 
         
          if (response.data.success) {
            setUsers(response.data.users);
            localStorage.setItem("webUsers", JSON.stringify(response.data.users)) 
           }
          
          setLoading(false)
        } catch (error) {
          console.error("Error fetching users:", error);
          setLoading(false)
        }
        
      }
      getUsers();

    },[]);

    const filteredUsers = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    const handleDeleteClick =  (user) => {
      setSelectedUser(user);
      setIsModalOpen(true);
    };
  
    const confirmDelete = async () => {
      
      try {
        setLoading(true)
        const responce = await axios.delete(`${url}/api/users/${selectedUser._id}`,{
          headers:{
            'Authorization': "Bearer "+adminToken
          }
        });
        if (responce.data.success) {
          setUsers(users.filter(u => u._id !== selectedUser._id));
          setIsModalOpen(false);
          setSelectedUser(null);
          console.log(`Deleted user: ${selectedUser.name}`);
        }
        setLoading(false)
        
      } catch (error) {
        console.error("Error deleting user:", error);
        setIsModalOpen(false);
        setSelectedUser(null);
        alert("Failed to delete user. Please try again later.");
        setLoading(false)
      }
    };
  
    return (
      <>
      <LoaderSpin isOpen={loading} />
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        
        <h3 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center"><User size={28} className="mr-3 text-blue-600" /> Manage Users</h3>
  
        <div className="mb-6 flex items-center space-x-3">
          <Search size={20} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
  
        <ul className="space-y-4">
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <li key={user._id} className="bg-gray-50 p-5 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-sm hover:shadow-md transition duration-200">
                <div>
                  <p className="font-medium text-lg text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email} | {user.role}</p>
                </div>
                <div className="flex space-x-3 mt-3 sm:mt-0">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    user.status === 'Active' ? 'bg-green-100 text-green-800' :
                    user.status === 'Suspended' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.status}
                  </span>
                  {/* <button className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50 transition duration-200" title="Edit User"><Edit size={20} /></button> */}
                  <button
                    onClick={() => handleDeleteClick(user)}
                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition duration-200"
                    title="Delete User"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-600 text-lg text-center py-4">No users found matching your search.</p>
          )}
        </ul>
  
        {/* Conceptual Pagination */}
        <div className="flex justify-center mt-8 space-x-4">
          <button className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300 transition duration-300 font-medium">Previous</button>
          <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition duration-300 font-medium">Next</button>
        </div>
  
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={confirmDelete}
          title="Confirm Deletion"
          message={`Are you sure you want to delete user "${selectedUser?.name}"? This action cannot be undone.`}
        />
      </div>
      </>
    );
  };

  export default ManageUsers;