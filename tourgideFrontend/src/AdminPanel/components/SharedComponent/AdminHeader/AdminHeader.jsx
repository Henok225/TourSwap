
import { useEffect, useState } from "react";
import { Shield, User, List, Flag, Edit, Trash2, Home, LogIn, Search, BarChart2, CheckCircle, XCircle, Briefcase, LogOutIcon } from 'lucide-react';
import AdminNavLink from "../AdminNavLink/AdminNavLink";
import LoaderSpin from "../../../../components/loaderSpin/Loader";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../ConfirmationModal/ConfirmationModal";



const AdminHeader = ({ currentPage, onNavigate, setAdminToken }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [loading,setLoading] = useState(false)
    const navigate = useNavigate()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFlag, setSelectedFlag] = useState(null);
    const [modalAction, setModalAction] = useState(''); // 'resolve' or 'dismiss'
  

    const handleActionClick = (flag) => {
      setSelectedFlag(flag);
      // setModalAction(action);
      setIsModalOpen(true);
    };
  
    const onLogout = ()=>{
      
           localStorage.removeItem('adminLoggedIn'),
            localStorage.removeItem('adminToken'),
            setAdminToken(null)
        navigate('/')
   
    }

    useEffect(() => {
      const handleScroll = () => {
        if (window.scrollY > lastScrollY && window.scrollY > 100) { // Scroll down, and past a threshold
          setIsVisible(false);
        } else if (window.scrollY < lastScrollY) { // Scroll up
          setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
      };
  
      window.addEventListener('scroll', handleScroll);
  
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, [lastScrollY]);
  
    return (
        <>
        {/* <LoaderSpin isOpen={loading} /> */}
          <header 
          className={`fixed top-0 left-0 w-full z-40 bg-gradient-to-r from-gray-800 to-gray-900 text-white p-4 shadow-xl transition-transform duration-300 ease-in-out
            ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}> {/* Apply transform for hide/show */}
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
              <h1 className="text-4xl font-extrabold tracking-tight mb-4 md:mb-0">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-cyan-400">Admin</span>Panel
              </h1>
              <nav className="space-x-2 sm:space-x-4 flex flex-wrap justify-center items-center">
                <AdminNavLink icon={BarChart2} label="Dashboard" page="dashboard" currentPage={currentPage} onNavigate={onNavigate} />
                <AdminNavLink icon={User} label="Users" page="manage-users" currentPage={currentPage} onNavigate={onNavigate} />
                <AdminNavLink icon={List} label="Listings" page="manage-listings" currentPage={currentPage} onNavigate={onNavigate} />
                <AdminNavLink icon={Flag} label="Flagged Content" page="flagged-content" currentPage={currentPage} onNavigate={onNavigate} />
                <button
            onClick={()=>handleActionClick("logout")}
            className="flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-300 text-sm md:text-base text-white hover:bg-gray-700 hover:text-white font-medium"
          >
            <LogOutIcon size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
              </nav>
            </div>
            
          </header>

          <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={onLogout}
          title={`Logout`}
          message={`Are you sure you want to logout from your admin pannel`}
        />
        </>
        
        
      
    );
  };

export default AdminHeader;