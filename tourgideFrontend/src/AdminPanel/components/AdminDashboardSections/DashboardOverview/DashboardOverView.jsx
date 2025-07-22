import axios from 'axios';
import { Shield, User, List, Flag, Edit, Trash2, Home, LogIn, Search, BarChart2, CheckCircle, XCircle, Briefcase } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../../../context/StoreContext';
import DashboardCharts from './DashboardCarts';


const DashboardOverview = ({setShowLogin}) => {
  const {url} = useContext(StoreContext);
  const [totalUsers,setTotalUsers] = useState(0)
  const [totalActiveList,setTotalActiveList] = useState(0)
  const [totalPendingList,setTotalPendingList] = useState(0)
  const [totalSuspendedList,setTotalSuspendedList] = useState(0)
  const [totalAgencies,setTotalAgencies] = useState(0)
  // Dummy data for statistics
  const stats = [
    { label: 'Total Users', value: totalUsers, icon: User, color: 'text-blue-500' },
    { label: 'Active Listings', value: totalActiveList, icon: List, color: 'text-green-500' },
    { label: 'Pending Flags', value: '4', icon: Flag, color: 'text-red-500' },
    { label: 'Agencies', value: totalAgencies, icon: Briefcase, color: 'text-purple-500' },
  ];

  const usersByRole = [
    { name: 'Travelers', value: totalUsers - totalAgencies },
    { name: 'Agencies', value: totalAgencies },
    { name: 'Admins', value: 2 },
  ];
  const listingsByStatus = [
    { name: 'Active', value: totalActiveList },
    { name: 'Pending Review', value: totalPendingList},
    { name: 'Suspended', value: totalSuspendedList },
  ];

  useEffect(()=>{
    const adminToken = localStorage.getItem("adminToken")
      
    const api = axios.create({
      baseURL: url+'/api/tours', // IMPORTANT: Replace with your actual backend API base URL
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer '+adminToken
      },
    });

    api.interceptors.response.use(
      (response) => response, // If the response is successful, just return it
      (error) => {
        // Check if the error is due to an HTTP 401 Unauthorized status
        // This typically indicates an expired or invalid token
        if (error.response && error.response.status === 403) {
          console.error('Authentication failed or token expired. Redirecting to login.');
          localStorage.removeItem('adminToken'); // Delete the expired token from local storage
          localStorage.removeItem('adminLoggedIn');
          setShowLogin(true) 
             window.location.reload;
        }
        return Promise.reject(error); // Re-throw the error so it can be caught by the calling component
      }
    );
    
    const getStat = async ()=>{
      try {
      const response = await api.get(url+"/api/tours/admin");
      if(response.data.success){
        setTotalActiveList(response.data.tours.filter(tr=>tr.status === 'Active').length)
        setTotalPendingList(response.data.tours.filter(tr=>tr.status === 'Pending Review').length)
        setTotalSuspendedList(response.data.tours.filter(tr=>tr.status === 'Suspended').length)
         setTotalUsers(JSON.parse(localStorage.getItem("webUsers")).length)
        setTotalAgencies(()=>{
          const users = localStorage.getItem("webUsers")
          const agenciesFiltered = JSON.parse(users).filter(user=>user.role != "user");
          return agenciesFiltered.length;
        
        })
      }
      
      } catch (error) {
        console.log("Couldn't fetch tours statistics",error)
        
      }
    }
    getStat();

  },[])



  return (
    <>
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-8">
      <h3 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center"><BarChart2 size={28} className="mr-3 text-gray-700" /> Dashboard Overview</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gray-50 p-5 rounded-xl shadow-sm flex items-center space-x-4">
            <div className={`p-3 rounded-full bg-opacity-20 ${stat.color.replace('text-', 'bg-')}`}>
              <stat.icon size={28} className={stat.color} />
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      
    </div>
    <DashboardCharts listingsByStatus={listingsByStatus} usersByRole={usersByRole} />
    </>
  );
};

export default DashboardOverview;