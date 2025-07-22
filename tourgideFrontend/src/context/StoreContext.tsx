import axios from "axios";
import { createContext, useEffect, useState } from "react";



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

    const [currentPage, setCurrentPage] = useState(localStorage.getItem("currentPage") || "");



    // Fetching recent bookings
    useEffect(() => {

        const currentBookings = async () => {

            try {
                const response = await axios.get(url + "/api/bookings/user/" + userData.userId);

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
        toReadableDate
    };

    return (
        <StoreContext.Provider value={contextValues}>
            {props.children}
        </StoreContext.Provider>
    );
}
export default StoreProvider;