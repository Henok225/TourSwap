// import React from 'react'
// import { Home, List, User, Briefcase, LogIn, UserPlus, BookOpen, Repeat, Star, PlusCircle, Edit, Trash2, Eye, MapPin, DollarSign, Award } from 'lucide-react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';


const NavLink = ({ icon: Icon, label, page,onNavigate }) => {
  const { currentPage, setCurrentPage } = useContext(StoreContext);
    const isActive = currentPage === page;
    const navigate = useNavigate();

    return (
      <button
        onClick={() => {navigate('/' + page), onNavigate(page); setCurrentPage(page); localStorage.setItem("currentPage", page)}}
        className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-300 text-sm md:text-base
          ${isActive ? 'bg-white text-blue-700 shadow-lg transform scale-105 font-semibold' : 'text-white hover:bg-blue-600 hover:text-white font-medium'}`}
      >
        <Icon size={18} />
        <span className="hidden sm:inline">{label}</span>
      </button>
    );
  };

export default NavLink
