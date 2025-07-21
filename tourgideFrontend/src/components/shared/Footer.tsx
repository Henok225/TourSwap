// import React from 'react'
// import { Home, List, User, Briefcase, LogIn, UserPlus, BookOpen, Repeat, Star, PlusCircle, Edit, Trash2, Eye, MapPin, DollarSign, Award } from 'lucide-react';


const Footer = () => {
    return (
      <footer className="bg-gray-900 text-white p-6 mt-12 rounded-t-3xl shadow-inner">
        <div className="container mx-auto text-center text-sm opacity-80">
          &copy; {new Date().getFullYear()} TourSwap. All rights reserved.
        </div>
      </footer>
    );
  };

export default Footer
