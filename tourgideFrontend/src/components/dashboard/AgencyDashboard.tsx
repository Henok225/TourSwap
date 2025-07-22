// import React from 'react'
import { Home, List, User, Briefcase, LogIn, UserPlus, BookOpen, Repeat, Star, PlusCircle, Edit, Trash2, Eye, MapPin, DollarSign, Award } from 'lucide-react';
import MakeTours from './MakeTours';
import { StoreContext } from '../../context/StoreContext';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import SmallLoadingSpinner from '../loaderSpin/SmallLoader'


// --- Tour Provider (Agency) Dashboard ---

const AgencyDashboard = ({ onNavigate }) => {
  const { url, token, userData } = useContext(StoreContext);
  const [makeTour, setMakeTour] = useState(false);
    const [agencyTours, setAgencyTours] = useState([
      { id: 1, name: 'Amazon Rainforest Adventure', status: 'Active', bookings: 12 },
      { id: 2, name: 'Kyoto Cherry Blossom Tour', status: 'Active', bookings: 8 },
      { id: 3, name: 'Safari in Serengeti', status: 'Draft', bookings: 0 },
    ]);
    const [bookingLoad,setBookingLoad] = useState(false)
    const [tourLoad,setTourLoad] = useState(false)
  
    const [recentBookings,setRecentBooking] =useState( [
      { _id: 101, tourName: 'Amazon Rainforest Adventure', traveler: 'Alice Smith', date: '2025-07-01' },
      { _id: 102, tourName: 'Kyoto Cherry Blossom Tour', traveler: 'Bob Johnson', date: '2025-06-28' },
      { _id: 103, tourName: 'Northern Lights Expedition', traveler: 'Carol White', date: '2025-06-25' },
    ]);
    const [refetchRecentbookings,setRefetchRecentbookings] = useState(false);
   const [selectedBookStatus, setSelectedBookStatus] = useState("")

    useEffect(() => {
      // Fetch agency tours from the backend with axios
      const fetchAgencyTours = async () => {
        try {
          
          const response = await axios.get(`${url}/api/tours/provider/${userData.userId}`,{
            headers:{
              Authorization: "Bearer "+token
            }
          });
          setAgencyTours(response.data);
          console.log('Agency tours fetched successfully:', response.data);
          setTourLoad(true)
        } catch (error) {
          console.error('Error fetching agency tours:', error);
          setTourLoad(false)
        }
      };
      fetchAgencyTours();
    }, []);

    
      // delete tours from the backend with axios
      const deleteTour = async (tourId) => {
        try {
          await axios.delete(`${url}/api/tours/remove/${tourId}`, {
            headers: {

              Authorization: `Bearer ${token}`,
            },
          });
          setAgencyTours(prevTours => prevTours.filter(tour => tour.id !== tourId));
          console.log('Tour deleted successfully');
        } catch (error) {
          console.error('Error deleting tour:', error);   
        }
      };

      // Fetching recent bookings
      useEffect(()=>{

        const currentBookings = async ()=>{
          
          try {
            const response = await axios.get(url+"/api/bookings/provider/"+userData.userId);
            if(response.data.success){
            setRecentBooking(response.data.booking)
            console.log(response.data.booking)
            setBookingLoad(true)
            }
            
          } catch (error) {
            console.log("Error fetching recent bookings", error)
          }
        }
        currentBookings();

      },[refetchRecentbookings])

      // changing the ISO date to regular
      const toReadableDate = (dateString)=>{

        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formated = new Date(dateString).toLocaleDateString('en-US', options);

        return formated;

      }

      const handleBookingStatus = async (e)=>{
         const currentStatus = e.target.value;
         const bookId = e.target.id;
         setSelectedBookStatus(currentStatus)
         try {
          setBookingLoad(true)
          const response = await axios.put(url+"/api/bookings/status/"+userData.userId,{currentStatus,bookId},
           { headers:{
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization':"Bearer "+token
            }
          })
          if(response.data.success){
            console.log(response.data.message || "status updated")
            setRefetchRecentbookings(!refetchRecentbookings)
          }
          setBookingLoad(false)
          
         } catch (error) {
           console.log("Error changing status!",error)
         }
      }
  
    return (
      <>
      {
        makeTour && <MakeTours setMakeTour={setMakeTour} />
      }
      <div className="container mx-auto p-6">
        <h2 className="text-4xl font-bold text-gray-800 mb-10 text-center">Tour Provider Dashboard</h2>
  
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Manage Tours */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h3 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center"><Edit size={28} className="mr-3 text-green-600" /> Manage Your Tours</h3>
            <button onClick={()=>setMakeTour(true)} className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition duration-300 mb-6 flex items-center font-medium shadow-md transform hover:scale-105">
              <PlusCircle size={20} className="mr-2" /> Add New Tour
            </button>
            {
              agencyTours ? 
             <> {agencyTours.length > 0 ? (
                <ul className="space-y-4">
                  { tourLoad ? agencyTours.map(tour => (
                    <li key={tour._id} className="bg-gray-50 p-5 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-sm hover:shadow-md transition duration-200">
                      <div>
                        <p className="font-medium text-lg text-gray-900">{tour.title}</p>
                        <p className="text-sm text-gray-600">Status: {tour.status} | Bookings: {tour.bookings}</p>
                      </div>
                      <div className="flex space-x-3 mt-3 sm:mt-0">
                        <button className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50 transition duration-200" title="Edit Tour"><Edit size={20} /></button>
                        <button className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition duration-200" title="Delete Tour" 
                        onClick={() => {setAgencyTours(prevTours => 
                          prevTours.filter(tou => tou._id !== tour._id)
                        ); deleteTour(tour._id)}}><Trash2 size={20} /></button>
                      </div>
                    </li>
                  )) : null}
                </ul>
              ) : (
                <p className="text-gray-600 text-lg">No tours added yet. Click "Add New Tour" to get started!</p>
              )}</>:null

            }
           
          </div>
  
          {/* View Bookings */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h3 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center"><Eye size={28} className="mr-3 text-indigo-600" /> Recent Bookings</h3>
            {recentBookings.length > 0 ? (
              <ul className="space-y-4">
                {bookingLoad ? recentBookings.map(book => (
                  <li key={book._id} className="bg-gray-50 p-5 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-sm hover:shadow-md transition duration-200">
                    <div>
                      <p className="font-medium text-lg text-gray-900">{book.tourId ? book.tourId.title:null}</p>
                      <p className="text-sm text-gray-600">Traveler: {book.fullName}</p>
                      {/* <button>Confirm</button> */}
                      <select name="status" 
                      id={book._id.toString()} 
                      value={ selectedBookStatus || book.status}
                      onChange={ handleBookingStatus}
                      >
                        <option  value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option  value="Denied">Denied</option>
                        <option value="Completed">Completed</option>
                      </select>

                    </div>
                    <span className="mt-2 sm:mt-0 text-sm text-gray-600">{toReadableDate(book.updatedAt)} <br /><span >{book.status}</span></span>

                  </li>
                )) : <SmallLoadingSpinner /> }
              </ul>
            ) : (
              <p className="text-gray-600 text-lg">No recent bookings.</p>
            )}
          </div>
        </div>
      </div>
      </>
      
    );
  };

export default AgencyDashboard
