// import React from 'react'
// import { Home, List, User, Briefcase, LogIn, UserPlus, BookOpen, Repeat, Star, PlusCircle, Edit, Trash2, Eye, MapPin, DollarSign, Award } from 'lucide-react';
import { use, useContext, useState } from 'react';
import './Login.css'
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import LoaderSpin from '../loaderSpin/Loader';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ onNavigate }) => {
    
    const { url, setToken, userData, setUserData, setCurrentPage } = useContext(StoreContext)
    const [currState, setCurrState] = useState("Login")
    const [loading, setLoading] = useState(false)

    const [serverResponse, setServerResponse] = useState<string | null>(null)
    const [data, setData] = useState({
      email: "",
      password: ""
    })
    const navigate = useNavigate();
  
    const onChangeHandler = (event) => {
      const name = event.target.name;
      const value = event.target.value;
      setData(data => ({ ...data, [name]: value }))
    }
  
  
    const onLogin = async (event) => {
  
      event.preventDefault()
      let newUrl = url;
        newUrl += "/api/auth/login"
     
      try {
        setServerResponse(null)
        setLoading(true)
        const response = await axios.post(newUrl, data);
        if (response.data.success) {
            
            localStorage.setItem("token", response.data.token)
            const tempUserData = JSON.stringify(response.data.data);
          localStorage.setItem("userData", tempUserData)
          setToken(response.data.token);
          setUserData(response.data.data);
          setServerResponse(response.data.message)
          navigate('/');
        }
        setServerResponse(response.data.message)
        console.log(response.data.message)
       
         
      } catch (error) {
  
        console.log("Error", error)
        setServerResponse("Server error try again later!")

  
      } finally {
        setLoading(false)
      }
  
  
    }
     
    return (
      <div className="login-page min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
         <LoaderSpin isOpen={loading} />
        <div className="bg-white p-8 rounded-2xl shadow-3xl w-full max-w-md transform transition-all duration-500 hover:scale-[1.01] border border-gray-100">
          <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Welcome Back!</h2>
          {serverResponse && (
            <div className="text-center text-red-500 mb-4">
              {serverResponse}
            </div>
          )}
          <form onSubmit={onLogin} className="space-y-6">
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
                name='password'
                id="password"
                onChange={onChangeHandler}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition duration-300 shadow-sm"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-lg hover:bg-blue-700 transition duration-300 shadow-lg transform hover:scale-105 hover:shadow-xl"
            >
              Sign In
            </button>
          </form>
          <p className="mt-6 text-center text-gray-600">
            Don't have an account?{' '}
            <button  onClick={() => {navigate('/register'), setCurrentPage('register'); localStorage.setItem("currentPage", 'register')}}
        className="text-blue-600 hover:underline font-bold">
              Register here
            </button>
          </p>
        </div>
      </div>
    );
  };


export default LoginPage
