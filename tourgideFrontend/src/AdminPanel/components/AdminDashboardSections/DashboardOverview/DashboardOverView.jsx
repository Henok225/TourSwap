import axios from 'axios';
import { Shield, User, List, Flag, Edit, Trash2, Home, LogIn, Search, BarChart2, CheckCircle, XCircle, Briefcase } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../../../context/StoreContext';


const DashboardOverview = () => {
  const {url} = useContext(StoreContext);
  const [totalUsers,setTotalUsers] = useState(0)
  const [totalTours,setTotalTours] = useState(0)
  const [totalAgencies,setTotalAgencies] = useState(0)
  // Dummy data for statistics
  const stats = [
    { label: 'Total Users', value: totalUsers, icon: User, color: 'text-blue-500' },
    { label: 'Active Listings', value: totalTours, icon: List, color: 'text-green-500' },
    { label: 'Pending Flags', value: '15', icon: Flag, color: 'text-red-500' },
    { label: 'Agencies', value: totalAgencies, icon: Briefcase, color: 'text-purple-500' },
  ];
  

  useEffect(()=>{
    
    const getStat = async ()=>{
      const adminToken = localStorage.getItem("adminToken")
      try {
      const response = await axios.get(url+"/api/tours/");
      if(response.data.success){
        setTotalTours(response.data.tours.filter(tr=>tr.status === 'active').length)
         setTotalUsers(JSON.parse(localStorage.getItem("webUsers")).length)
        setTotalAgencies(()=>{
          const users = localStorage.getItem("webUsers")
          const agenciesFiltered = JSON.parse(users).filter(user=>user.role != "traveler");
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
  );
};

export default DashboardOverview;