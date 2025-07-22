import { useState } from "react";
import { Shield, User, List, Flag, Edit, Trash2, Home, LogIn, Search, BarChart2, CheckCircle, XCircle, Briefcase } from 'lucide-react';
import DashboardOverview from "../components/AdminDashboardSections/DashboardOverview/DashboardOverView";
import ManageUsers from "../components/AdminDashboardSections/ManageUser/ManageUsers";
import ManageListings from "../components/AdminDashboardSections/ManageListings/ManageListing";
import AdminFooter from "../components/SharedComponent/AdminFooter/AdminFooter";
import AdminHeader from "../components/SharedComponent/AdminHeader/AdminHeader";
import ReviewFlaggedContent from "../components/AdminDashboardSections/ReviewFlaggedContent/ReviewFlaggedContent";
import AdminLogin from "../components/Auth/AdminLogin";



const DashboardApp = ({onNavigate}) => {
    const [currentPage, setCurrentPage] = useState('dashboard'); // Default to Dashboard
    const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || null); 
    const [showlogin, setShowLogin] = useState(true);

    
    const handleNavigate = (page) => {
      setCurrentPage(page);
      // In a real app, 'logout' would handle authentication logic
      if (page === 'logout') {
          console.log('Admin logged out');
          // Redirect to login or home page of the main app if needed
      }
    };
  
    const renderPage = () => {
      switch (currentPage) {
        case 'dashboard':
          return <DashboardOverview setShowLogin={setShowLogin} />;
        case 'manage-users':
          return <ManageUsers adminToken={adminToken} />;
        case 'manage-listings':
          return <ManageListings adminToken={adminToken}/>;
        case 'flagged-content':
          return <ReviewFlaggedContent adminToken={adminToken}/>;
        // case 'logout':
        //   return (
          
        //   <div className="container mx-auto p-6 text-center text-gray-600 text-xl">Logging out...</div>
       
        //   );
        default:
          return <DashboardOverview />;
      }
    };
  
    return (
      <div className="min-h-screen flex flex-col font-sans bg-gray-50 text-gray-800">

        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
            
            /* Custom shadows for modern feel */
            .shadow-xl {
              box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            }
            .shadow-2xl {
              box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            }
            .shadow-3xl {
              box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.15), 0 15px 30px -5px rgba(0, 0, 0, 0.08);
            }
          `}
        </style>
        <AdminLogin setAdminToken={setAdminToken} setShowLogin={setShowLogin} showlogin={showlogin} onNavigate={onNavigate} />

        {
            adminToken ? 
                <>
                <AdminHeader currentPage={currentPage} onNavigate={handleNavigate} setAdminToken={setAdminToken} />
        
        <main className="flex-grow py-8 container mx-auto" style={{ paddingTop: '80px' }}> {/* Add padding to main content */}
          {renderPage()}
        </main>
        {/* <AdminFooter /> */}
                </>
                :
               null
        }
        
      </div>
    );
  };

  export default DashboardApp;