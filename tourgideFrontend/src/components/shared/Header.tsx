// import React from 'react'
import { useContext, useEffect } from 'react';
import NavLink from './NavLink';
import { Home, List, User, Briefcase, Settings, LogIn, UserPlus, LogOutIcon } from 'lucide-react';
import { StoreContext } from '../../context/StoreContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Header = ({onNavigate}) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
    
   const {token, userData} = useContext(StoreContext);

   const [showSettingsCard, setShowSettingsCard] = useState(false);

   const toggleSettingsCard = () => {
     setShowSettingsCard(!showSettingsCard);
   };

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
      <><header style={{position:'sticky', margin:0, top:0, zIndex:'10', width:'100%'}}
       className={`header bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-4 shadow-xl rounded-b-3xl transition-transform duration-300 ease-in-out
      ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4 md:mb-0">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-orange-400">Tour</span>Swap
          </h1>
          <nav className="space-x-2 sm:space-x-4 flex flex-wrap justify-center items-center">
            <NavLink icon={Home} label="Home" page=""  onNavigate={()=>{onNavigate(''), setShowSettingsCard(false) }}/>
            <NavLink icon={List} label="Tours" page="tours"  onNavigate={()=>{onNavigate('tours'), setShowSettingsCard(false) }}/>
            {
              token ? 
              <>
              
              {
               
                userData.role === "user" ? 
                <>

                <NavLink icon={User} label="Traveler" page="traveler-dashboard"  onNavigate={()=>{onNavigate('traveler-dashboard'), setShowSettingsCard(false) }}/>
                <div onClick={ toggleSettingsCard} style={{cursor:"pointer"}} className='settings-card flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-300 text-sm md:text-base hover:bg-blue-600 hover:text-white'><Settings size={18}/> <span>Settings</span></div>
            
                </>
                :
            <><NavLink icon={Briefcase} label="Agency" page="agency-dashboard"  onNavigate={()=>{onNavigate('agency-dashboard'), setShowSettingsCard(false) }}/>
            
                <div onClick={ toggleSettingsCard} style={{cursor:"pointer"}} className='settings-card flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-300 text-sm md:text-base hover:bg-blue-600 hover:text-white'><Settings size={18}/> <span>Settings</span></div>
            
            </>
              }
              </>
            :
              <> <NavLink icon={LogIn} label="Login" page="login"  onNavigate={onNavigate}/>
            <NavLink icon={UserPlus} label="Register" page="register"  onNavigate={onNavigate}/>
            </>
            }
           
            
          </nav>
        </div>
        
      </header>
      {showSettingsCard && (
        
                  <div
                  style={{ position: 'fixed', top: '100px', right: '20px', zIndex: 2 }}
                    className=" bg-white text-black shadow-lg rounded-lg p-4 w-64"
                   
                  >
                    {}
                    <h3 className="font-bold text-lg mb-2">Settings</h3>
                    <div className="space-y-2">
                      <button
                        className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
                        onClick={() => alert('Theme preference clicked')}
                      >
                        Theme Preference
                      </button>
                      <button
                        className=" flex w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
                        onClick={() => {localStorage.removeItem('token'); localStorage.removeItem('userData'); onNavigate('login'); navigate('/'); window.location.reload()}}
                      >
                        <LogOutIcon size={18} /><span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
      </>
    );
  };

export default Header
