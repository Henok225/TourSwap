import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";



export const StoreContext = createContext(null);

const StoreProvider = (props) => {

    const url = "http://localhost:5000";
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [userData, setUserData] = useState(() => {
        const storedUser = localStorage.getItem("userData");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [tourInView, setTourInView] = useState(() => {
        const storedTour = localStorage.getItem("tourInView");
        return storedTour ? JSON.parse(storedTour) : null;
    });
    const [bookedTours, setBookedTours] = useState([])
    const [bookingLoad, setBookingLoad] = useState(false)
    const [expiredToken,setExpiredToken] =useState(false)

    const [currentPage, setCurrentPage] = useState(localStorage.getItem("currentPage") || "");
    const [featuredTours,setFeaturedTours] = useState(localStorage.getItem("featuredTour"))
    // const navigate = useNavigate();


    // Fetching recent bookings
    useEffect(() => {

        const api = axios.create({
            baseURL: url+'/api/tours', // IMPORTANT: Replace with your actual backend API base URL
            timeout: 10000,
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': 'Bearer '+token
            },
          });
      
          // Response Interceptor (Crucial for handling token expiration/errors)
        api.interceptors.response.use(
        (response) => response, // If the response is successful, just return it
        (error) => {
          // Check if the error is due to an HTTP 401 Unauthorized status
          // This typically indicates an expired or invalid token
          if (error.response && error.response.status === 403) {
            console.error('Authentication failed or token expired. Redirecting to login.');
            localStorage.removeItem('token'); // Delete the expired token from local storage 
               setExpiredToken(true);
          }
          return Promise.reject(error); // Re-throw the error so it can be caught by the calling component
        }
      );

        const currentBookings = async () => {

            try {
                const response = await api.get(url + "/api/bookings/user/" + userData.userId);

                if (response.data.success) {
                    setBookedTours(response.data.booking)
                    setBookingLoad(true)
                }

            } catch (error) {
                console.log("Error fetching recent bookings", error)
            }
        }
        currentBookings();

    }, [])
    

     // changing the ISO date to regular
     const toReadableDate = (dateString)=>{

        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formated = new Date(dateString).toLocaleDateString('en-US', options);
  
        return formated;
  
      }



    const contextValues = {
        url,
        token,
        setToken,
        userData,
        setUserData,
        currentPage,
        setCurrentPage,
        tourInView,
        setTourInView,
        bookedTours,
        bookingLoad,
        toReadableDate,
        expiredToken,
        setExpiredToken,
        featuredTours,
        setFeaturedTours
    };

    return (
        <StoreContext.Provider value={contextValues}>
            {props.children}
        </StoreContext.Provider>
    );
}
export default StoreProvider;