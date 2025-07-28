// import React from 'react'
import axios from 'axios';
import { Home, List, User, Briefcase, LogIn, UserPlus, BookOpen, Repeat, Star, PlusCircle, Edit, Trash2, Eye, MapPin, DollarSign, Award } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import TravelerSwapRequestsSection from './SwapRequests';
import TravelerReviewsSection from './SubmitReview';


// --- Traveler Dashboard ---

const TravelerDashboard = ({ onNavigate }) => {

    const {url,token,userData, toReadableDate} = useContext(StoreContext)
    const [bookedTours,setBookedTours] = useState([
      { id: 101, name: 'Paris City Break', date: '2025-09-15', status: 'Confirmed' },
      { id: 102, name: 'Rome Historical Tour', date: '2025-11-20', status: 'Pending' },
      { id: 103, name: 'New York Explorer', date: '2025-08-01', status: 'Completed' },
    ]);
    const [bookingLoad,setBookingLoad] = useState(false)
  
    // const swapRequests = [
    //   { id: 201, tourName: 'Bali Retreat', status: 'Incoming', requester: 'Jane Doe', date: '2025-10-05' },
    //   { id: 202, tourName: 'Thailand Beaches', status: 'Outgoing', recipient: 'John Smith', date: '2025-09-25' },
    // ];
  

    // Fetching recent bookings
    useEffect(()=>{

      const currentBookings = async ()=>{
        
        try {
          const response = await axios.get(url+"/api/bookings/user/"+userData.userId);
          
          if(response.data.success){
          setBookedTours(response.data.booking.filter(book=>book.status !== "Reviewed" ))
          setBookingLoad(true)
          }
          
        } catch (error) {
          console.log("Error fetching recent bookings", error)
        }
      }
      currentBookings();

    },[])

  
    return (
      <div className="container mx-auto p-6">
        <h2 className="text-4xl font-bold text-gray-800 mb-10 text-center">Traveler Dashboard <br/> for <span style={{color:"lightblue"}}>{userData.username}</span> </h2>
  
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booked Tours */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h3 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center"><BookOpen size={28} className="mr-3 text-blue-600" /> Your Booked Tours</h3>
            {bookedTours.length > 0 ? (
              <ul className="space-y-4">
               {
                bookingLoad ? <>
                 { bookedTours.map(tour => (
                  <li key={tour._id} className="bg-gray-50 p-5 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-sm hover:shadow-md transition duration-200">
                    <div>
                      <p className="font-medium text-lg text-gray-900">{tour.tourId.title}</p>
                      <p className="text-sm text-gray-600">Date: {toReadableDate(tour.updatedAt)}</p>
                    </div>
                    <span className={`mt-2 sm:mt-0 px-4 py-1 rounded-full text-sm font-semibold ${
                      tour.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                      tour.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {tour.status}
                    </span>
                  </li>
                ))}</>:null
               }
              </ul>
            ) : (
              <p className="text-gray-600 text-lg">No tours booked yet. Start exploring!</p>
            )}
          </div>
  
          {/* Swap Requests */}
          {/* <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h3 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center"><Repeat size={28} className="mr-3 text-purple-600" /> Swap Requests</h3>
            {swapRequests.length > 0 ? (
              <ul className="space-y-4">
                {swapRequests.map(request => (
                  <li key={request.id} className="bg-gray-50 p-5 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-sm hover:shadow-md transition duration-200">
                    <div>
                      <p className="font-medium text-lg text-gray-900">{request.tourName}</p>
                      <p className="text-sm text-gray-600">
                        {request.status === 'Incoming' ? `From: ${request.requester}` : `To: ${request.recipient}`} on {request.date}
                      </p>
                    </div>
                    <span className={`mt-2 sm:mt-0 px-4 py-1 rounded-full text-sm font-semibold ${
                      request.status === 'Incoming' ? 'bg-indigo-100 text-indigo-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {request.status}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 text-lg">No swap requests at the moment.</p>
            )}
          </div> */}
          <TravelerSwapRequestsSection />

  
          {/* Submit Reviews */}
          <TravelerReviewsSection />
        </div>
      </div>
    );
  };

export default TravelerDashboard
