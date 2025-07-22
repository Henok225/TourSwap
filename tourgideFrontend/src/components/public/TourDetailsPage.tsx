// import React from 'react'
import { Home, List, User, Briefcase, LogIn, UserPlus, BookOpen, Repeat, Star, PlusCircle, Edit, Trash2, Eye, MapPin, DollarSign, Award, Book, UserCircle2 } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import Booking from '../dashboard/Booking';
import SwapConfirmationModal from './TourSwapConfirm';
import axios from 'axios';
import TourReviewsSection from './TourReviews';


const TourDetailsPage = ({ tourId, onNavigate }) => {
    
  const { url,token, tourInView, bookingLoad, bookedTours } = useContext(StoreContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [serverResponse, setServerResponse] = useState<string | null>(null);
  const [booking, setBooking] = useState(false)
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);

  const handleSwapConfirm = async (swapData) => {
    // This is where you'd send the swap request to your backend
    try {
       const response = await axios.post(url+'/api/swap/outgoing', swapData,{
        headers:{
        "Authorization": "Bearer "+token
       }});
      if(response.data.success){
        console.log("swap request has been sent successfully!")
      }
    
     } catch (error) {
      console.error("Failed to send swap request (simulated):", error);
      throw new Error("Failed to send swap request."); 
    }
  };
    // const tour = {
      // id: tourId,
      // name: 'Amazon Rainforest Adventure',
      // location: 'Brazil',
      // price: '$1500',
      // rating: 4.8,
      // description: 'Immerse yourself in the unparalleled biodiversity of the Amazon Rainforest. This 7-day expedition includes guided jungle treks, river cruises, wildlife spotting, and cultural exchanges with local communities. Experience the vibrant ecosystem, from colorful birds to elusive jaguars, and learn about sustainable tourism efforts. Accommodation will be in eco-lodges, providing an authentic yet comfortable experience.',
      // includes: ['Accommodation', 'Meals', 'Guided tours', 'Transfers', 'Expert local guides'],
      // excludes: ['International flights', 'Personal expenses', 'Travel insurance', 'Souvenirs'],
      // imageUrl: 'https://cdn2.rhinoafrica.com/thumbnails/media/_en/destinations/root/africa/east-africa/tanzania/serengeti-and-the-north-of-tanzania/greater-serengeti-ecosystem/serengeti-national-park/_img/gallery/53383/image-thumb__53383__background-cover/field-with-zebras-and-blue-wildebeest_192248950.ed7d5949.jpg',
      // reviews: [
      //   { id: 1, author: 'Alice Wonderland', rating: 5, comment: 'Absolutely breathtaking! The guides were incredibly knowledgeable and the wildlife spotting was incredible. A trip of a lifetime!' },
      //   { id: 2, author: 'Bob The Builder', rating: 4, comment: 'A truly unique experience. A bit humid, but worth it! The eco-lodge was comfortable and the food was surprisingly good.' },
      //   { id: 3, author: 'Charlie Chaplin', rating: 5, comment: 'Incredible journey! Every day was an adventure. Highly recommend for nature lovers.' },
      // ]

    // };
    const tour = tourInView || {
      id: tourId,
      name: 'Amazon Rainforest Adventure',
      location: 'Brazil',
      price: '$1500',
      rating: 4.8,
      description: 'Immerse yourself in the unparalleled biodiversity of the Amazon Rainforest. This 7-day expedition includes guided jungle treks, river cruises, wildlife spotting, and cultural exchanges with local communities. Experience the vibrant ecosystem, from colorful birds to elusive jaguars, and learn about sustainable tourism efforts. Accommodation will be in eco-lodges, providing an authentic yet comfortable experience.',
      includes: ['Accommodation', 'Meals', 'Guided tours', 'Transfers', 'Expert local guides'],
      excludes: ['International flights', 'Personal expenses', 'Travel insurance', 'Souvenirs'],
      imageUrl: 'https://cdn2.rhinoafrica.com/thumbnails/media/_en/destinations/root/africa/east-africa/tanzania/serengeti-and-the-north-of-tanzania/greater-serengeti-ecosystem/serengeti-national-park/_img/gallery/53383/image-thumb__53383__background-cover/field-with-zebras-and-blue-wildebeest_192248950.ed7d5949.jpg',
      reviews: [
        { id: 1, author: 'Alice Wonderland', rating: 5, comment: 'Absolutely breathtaking! The guides were incredibly knowledgeable and the wildlife spotting was incredible. A trip of a lifetime!' },
        { id: 2, author: 'Bob The Builder', rating: 4, comment: 'A truly unique experience. A bit humid, but worth it! The eco-lodge was comfortable and the food was surprisingly good.' },
        { id: 3, author: 'Charlie Chaplin', rating: 5, comment: 'Incredible journey! Every day was an adventure. Highly recommend for nature lovers.' },
      ]

    };
  
    if (!tour) {
      return <div className="container mx-auto p-6 text-center text-red-500 text-xl font-semibold">Tour not found.</div>;
    }

    const myBookedTours = bookedTours;

    useEffect(() => {
      window.scrollTo(0, 0); // Scrolls to the top-left corner of the window
    }, [booking]);

  
    return (
      <>
      { booking && <Booking setBooking={setBooking} tourId={tour.id} tourName={tour.title} />}
      
      <div  className=" mx-auto p-6">
        <div style={{width:'max(60%,330px)', margin:'auto'}} className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <img src={tour.imageUrl} alt={tour.name} className="w-full h-80 md:h-96 object-cover rounded-t-3xl" />
          <div className="p-8 md:p-12">
          <div style={{float:"right"}} className="flex items-center gap-2 text-base font-medium text-gray-700">
      <UserCircle2 className="w-5 h-5 text-blue-600" />
      <p className="capitalize">{tour.providerName}</p>
    </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">{tour.title}</h2>
            
            
            
            <p className="text-gray-700 text-xl md:text-2xl mb-4 flex items-center"><MapPin size={24} className="mr-3 text-blue-600" /> {tour.location}</p>
            <p className="text-blue-700 font-bold text-4xl md:text-5xl mb-6 flex items-center"><DollarSign size={32} className="mr-2" />{tour.price.toString().replace('$', '')}</p>
            <div className="flex items-center mb-8">
              <Award size={28} className="text-yellow-500 mr-2" />
              <span className="text-gray-800 text-2xl font-semibold">{tour.rating} Stars</span>
            </div>
  
            <p className="text-gray-700 text-lg leading-relaxed mb-10">{tour.description}</p>
  
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-10">
             
            {
                tour.excludes ? <div>
                 <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center"><PlusCircle size={24} className="mr-3 text-green-600" /> What's Included</h3> 
                 <ul className="list-disc list-inside text-gray-700 space-y-3 pl-4">
                  {tour?.includes.map((item, index) => <li key={index} className="text-lg">{item}</li>)}
                </ul> 
              </div>:null}

              {
                tour.excludes ? <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center"><Trash2 size={24} className="mr-3 text-red-600" /> What's Excluded</h3>
                 <ul className="list-disc list-inside text-gray-700 space-y-3 pl-4">
                  {tour.excludes.map((item, index) => <li key={index} className="text-lg">{item}</li>)}
                </ul> 
              </div>:null}
            </div> 
  
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-10">
              <button  onClick={()=>setBooking(true)} className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-semibold text-xl hover:bg-blue-700 transition duration-300 shadow-lg transform hover:scale-105 flex items-center justify-center">
                <BookOpen size={24} className="mr-3" /> Book Now
              </button>
              <button onClick={()=>setIsSwapModalOpen(true)} className="flex-1 bg-purple-600 text-white py-4 rounded-xl font-semibold text-xl hover:bg-purple-700 transition duration-300 shadow-lg transform hover:scale-105 flex items-center justify-center">
                <Repeat size={24} className="mr-3" /> Swap This Tour
              </button>
            </div>
{/*   
            <section className="mt-12">
              <h3 className="text-3xl font-bold text-gray-800 mb-6">Reviews ({tour.reviews.length})</h3>
              {tour.reviews.length > 0 ? (
                <div className="space-y-8">
                  {tour.reviews.map(review => (
                    <div key={review.id} className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200">
                      <div className="flex items-center mb-3">
                        <span className="font-semibold text-lg text-gray-900">{review.author}</span>
                        <div className="flex ml-4">
                          {[...Array(review.rating)].map((_, i) => <Star key={i} size={20} className="text-yellow-500 fill-yellow-500" />)}
                          {[...Array(5 - review.rating)].map((_, i) => <Star key={i} size={20} className="text-gray-300" />)}
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-lg">No reviews yet. Be the first to review!</p>
              )}
            </section> */}

            
          </div>
          <TourReviewsSection tourId={tourInView._id} />
  
            <div className="mt-10 text-center">
              <button
                onClick={() => navigate('/tours')}
                className="text-blue-600 hover:underline font-bold flex items-center mx-auto text-lg"
              >
                <List size={20} className="mr-2" /> Back to Tour Listing
              </button>
              <br />
            </div>
        </div>
        
      </div>

       {/* Swap Confirmation Modal */}
       <SwapConfirmationModal
        isOpen={isSwapModalOpen}
        onClose={() => setIsSwapModalOpen(false)}
        requestedTour={tour} // The tour user wants to swap for
        myBookedTours={myBookedTours} // User's own booked tours
        onConfirmSwap={handleSwapConfirm} // Function to send data to backend
      />
      </>
    );
  };

export default TourDetailsPage
