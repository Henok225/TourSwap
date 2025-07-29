import axios from "axios";
import { createContext, useEffect, useState, type JSXElementConstructor, type ReactElement, type ReactNode, type ReactPortal } from "react";
// import { useNavigate } from "react-router-dom";



export const StoreContext = createContext(null);

const StoreProvider = (props: { children: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => {

    const url = "http://localhost:5000";
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [userData, setUserData] = useState(() => {
        const storedUser = localStorage.getItem("userData");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [tourInView, setTourInView] = useState(() => {
        const storedTour = localStorage.getItem("tourInView");
        console.log(storedTour)
        return storedTour ? JSON.parse(storedTour) : null;
    });
    const [bookedTours, setBookedTours] = useState([])
    const [bookingLoad, setBookingLoad] = useState(false)
    const [expiredToken,setExpiredToken] =useState(false)

    const [currentPage, setCurrentPage] = useState(localStorage.getItem("currentPage") || "");
    const [featuredTours,setFeaturedTours] = useState([])
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

    // fetching tours
    useEffect(() => {
        axios.get(url+'/api/tours/')
          .then(response => {
            const featured_tours = response.data.tours.filter(ftr=>ftr.rating >= 4)
            // console.log(response.data.featuredTours)
            setFeaturedTours(response.data.tours.filter(ftr=>ftr.rating >= 4))
            // localStorage.setItem("featuredTour", JSON.stringfy(featured_tours))
  
             })
          .catch(error => {
            console.error('Error fetching tours:', error)
            
      });
        // console.log('Server Response:', serverResponse);
      }, []);
    

     // changing the ISO date to regular
     const toReadableDate = (dateString: string | number | Date)=>{

        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formated = new Date(dateString).toLocaleDateString('en-US', options);
  
        return formated;
  
      }

      // price format
      function formatPrice(amount, currency = 'USD', locale = 'en-US') {
        // Basic validation to ensure the amount is a valid number
        if (typeof amount !== 'number' || isNaN(amount)) {
          console.error(`Invalid input for amount: ${amount}. Must be a number.`);
          return 'Invalid Amount'; // Or throw an error, depending on desired behavior
        }
      
        try {
          // Create a NumberFormat object with specified locale and currency options
          const formatter = new Intl.NumberFormat(locale, {
            style: 'currency',      // Specifies that it's a currency format
            currency: currency,     // The currency code (e.g., 'USD', 'EUR')
            minimumFractionDigits: 2, // Ensure at least 2 decimal places
            maximumFractionDigits: 2  // Ensure no more than 2 decimal places
          });
      
          // Format the amount
          return formatter.format(amount);
        } catch (error) {
          console.error(`Error formatting price for amount ${amount} with currency ${currency} and locale ${locale}:`, error);
          return 'Formatting Error'; // Generic error message
        }
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
        setFeaturedTours,
        formatPrice
    };

    return (
        <StoreContext.Provider value={contextValues}>
            {props.children}
        </StoreContext.Provider>
    );
}
export default StoreProvider;