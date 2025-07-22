
import { LogIn, LogOutIcon } from 'lucide-react'; 
import { useContext, useEffect, useState } from 'react';
import './AdminLogin.css'; 
import axios from 'axios';
import { StoreContext } from '../../../context/StoreContext'; 
import { useNavigate } from 'react-router-dom';

const AdminLogin = ({ setAdminToken, onNavigate, showlogin,setShowLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const {url, setCurrentPage} = useContext(StoreContext)
 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation and "login" logic for MVP
    // if (email === 'admin@example.com' && password === 'adminpass') {
    // //   onLoginSuccess();
    // } else {
    //   setError('Invalid credentials. Please try again.');
    // }


    // Simulate saving login state
    // localStorage.setItem('adminLoggedIn', 'true');
    // setShowLogin(false);
    // setEmail('');
    // setPassword('');
  
    try {

        const response = await axios.post(url+'/api/admin/login', {
          email,
          password,
        });
        if (response.data.success) {
          // Save login state in localStorage
          localStorage.setItem('adminLoggedIn', 'true');
          localStorage.setItem('adminToken', response.data.token); 
          setShowLogin(false);
          setEmail('');
          setPassword(''); 
          setAdminToken(response.data.token); 

        }
        

        
    } catch (error) {
        console.error("Login failed:", error);
        setError('Login failed. Please try again.');
        
    }

};

  useEffect(() => {
    // Simulate an API call to check if the admin is already logged in
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (isLoggedIn) {
      setShowLogin(false);
    //   onLoginSuccess();
    } else {
      setShowLogin(true);
    }
  }, []);

  return (
    <div className={showlogin ? "admin-login min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4" : "admin-login-hide"}>
       <div className="bg-white p-8 rounded-2xl shadow-3xl w-full max-w-md transform transition-all duration-500 hover:scale-[1.01] border border-gray-100">
       <LogOutIcon size={20} onClick={()=>{localStorage.setItem("currentPage", ""); navigate("/"); setCurrentPage("")}} /> <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Admin Login</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="admin-email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
            <input
              type="email"
              id="admin-email"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-teal-500 focus:border-teal-500 transition duration-300 shadow-sm"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              id="admin-password"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-teal-500 focus:border-teal-500 transition duration-300 shadow-sm"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-3 rounded-xl font-semibold text-lg hover:bg-gray-700 transition duration-300 shadow-lg transform hover:scale-105 hover:shadow-xl"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
