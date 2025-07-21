import { createContext, useState } from "react";



export const StoreContext = createContext(null);

const StoreProvider = (props)=>{

    const url = "http://localhost:5000";
    const [token,setToken] = useState(localStorage.getItem("token"));
    const [userData,setUserData] = useState(() => {
        const storedUser = localStorage.getItem("userData");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [tourInView, setTourInView] = useState(() => {
        const storedTour = localStorage.getItem("tourInView");
        return storedTour ? JSON.parse(storedTour) : null;
    });
    
    const [currentPage, setCurrentPage] = useState(localStorage.getItem("currentPage") || "");

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
    };

    return (
        <StoreContext.Provider value={contextValues}>
            {props.children}
        </StoreContext.Provider>
    );
}
export default StoreProvider;