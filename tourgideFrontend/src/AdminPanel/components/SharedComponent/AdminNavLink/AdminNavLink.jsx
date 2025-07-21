import { Shield, User, List, Flag, Edit, Trash2, Home, LogIn, Search, BarChart2, CheckCircle, XCircle, Briefcase } from 'lucide-react';


const AdminNavLink = ({ icon: Icon, label, page, currentPage, onNavigate }) => {
    const isActive = currentPage === page;
    return (
      <button
        onClick={() => onNavigate(page)}
        className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-300 text-sm md:text-base
          ${isActive ? 'bg-white text-gray-800 shadow-lg transform scale-105 font-semibold' : 'text-white hover:bg-gray-700 hover:text-white font-medium'}`}
      >
        <Icon size={18} />
        <span className="hidden sm:inline">{label}</span>
      </button>
    );
  };

  export default AdminNavLink;