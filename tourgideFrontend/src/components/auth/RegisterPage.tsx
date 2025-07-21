// import React from 'react'
// import { Home, List, User, Briefcase, LogIn, UserPlus, BookOpen, Repeat, Star, PlusCircle, Edit, Trash2, Eye, MapPin, DollarSign, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import { useContext, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import LoaderSpin from '../loaderSpin/Loader';

const RegisterPage = ({ onNavigate }) => {
    
    const navigate = useNavigate();
    const { url, setToken, userData, setUserData, setCurrentPage } = useContext(StoreContext)
    // const [currState, setCurrState] = useState("Login")
  const [loading, setLoading] = useState(false)
  const [serverResponse, setServerResponse] = useState<string | null>(null)
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user" // Default role
  })

    const onChangeHandler = (event) => {
      const name = event.target.name;
      const value = event.target.value;
      setData(data => ({ ...data, [name]: value }))
    }
  
    const onRegister = async (event) => {
  
      event.preventDefault()
      let newUrl = url;
      
        newUrl += "/api/auth/signup"
     
  
      try {
        setServerResponse(null)
        setLoading(true)
        const response = await axios.post(newUrl, data);
        // if (response.data.success) {
          // Store token and user data in localStorage 
            // localStorage.setItem("token", response.data.token)
            // const tempUserData = JSON.stringify(response.data.data);
          // localStorage.setItem("userData", tempUserData)
          // setToken(response.data.token);
          // setServerResponse(response.data.message)
          
        // }
        setServerResponse(response.data.message)
        console.log(response.data.message)
        navigate('/');
         
      } catch (error) {
  
        console.log("Error", error)
        setServerResponse("Server error try again later!")

  
      } finally {
        setLoading(false)
      }
  
  
    }
    
    return (
      <div className="register-page min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <LoaderSpin isOpen={loading} />
        <div className="bg-white p-8 rounded-2xl shadow-3xl w-full max-w-md transform transition-all duration-500 hover:scale-[1.01] border border-gray-100">
          <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Join TourSwap!</h2>
          {/* server response */}
          {serverResponse && (
            <div className="text-center text-red-500 mb-4">
              {serverResponse}
            </div>
          )}
          <form onSubmit={onRegister} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                id="name"
                name='name'
                onChange={onChangeHandler}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition duration-300 shadow-sm"
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                type="email"
                id="email"
                name='email'
                onChange={onChangeHandler}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition duration-300 shadow-sm"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                id="password"
                name='password'
                onChange={onChangeHandler}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition duration-300 shadow-sm"
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Register as</label>
              <select
                id="role"
                name='role'
                onChange={onChangeHandler}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition duration-300 shadow-sm"
              >
                <option value="user">User</option>
                <option value="provider">Tour Provider (Agency)</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold text-lg hover:bg-green-700 transition duration-300 shadow-lg transform hover:scale-105 hover:shadow-xl"
            >
              Register
            </button>
          </form>
          <p className="mt-6 text-center text-gray-600">
            Already have an account?{' '}
            <button   onClick={() => {navigate('/login'), setCurrentPage('login'); localStorage.setItem("currentPage", 'login')}}
        className="text-green-600 hover:underline font-bold">
              Login here
            </button>
          </p>
        </div>
      </div>
    );
  };

export default RegisterPage
