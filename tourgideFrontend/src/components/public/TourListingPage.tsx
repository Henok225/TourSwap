// import React from 'react'
import axios from 'axios';
import { Home, List, User, Briefcase, LogIn, UserPlus, BookOpen, Repeat, Star, PlusCircle, Edit, Trash2, Eye, MapPin, DollarSign, Award, Link2, Clock, Tag, UserCircle2 } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import SmallLoadingSpinner from '../loaderSpin/SmallLoader';


const TourListingPage = ({ onNavigate }) => {

  const { url, setTourInView } = useContext(StoreContext);
  const [loading, setLoading] = useState(true);
  const [loadSuccess, setLoadSuccess] = useState(false);
  const [serverResponse, setServerResponse] = useState<string | null>(null);
    const navigate = useNavigate();
    const [tours, setTours] = useState([]);
    const [filteredTours, setFilteredTours] = useState(tours);
    const [filterdata, setFilterData] = useState({
      location: '',
      price: 0,
      rating: 0
    });
    const [externalData,setExternalData] = useState([])

    const onFilterChangeHandler = (event) => {
      const name = event.target.name;
      const value = event.target.value;
      setFilterData(data => ({ ...data, [name]: value }))
    }

    const handleViewDetails = (tourId) => {
      setTourInView(tours.find(tour => tour._id === tourId));
      localStorage.setItem('tourInView', JSON.stringify(tours.find(tour => tour._id === tourId)));
      navigate('/tours/' + tourId);
      onNavigate('tour-details', { tourId });
    };

    // fetching tours from the backend can be done here with aixos
    useEffect(() => {
      axios.get(url+'/api/tours/')
        .then(response => {
          setTours(response.data.tours);
          setFilteredTours(response.data.tours);
          setServerResponse(response.data.message || 'Tours fetched successfully');
          setLoadSuccess(true);
          console.log('Tours fetched successfully:',response.data.tours);
        })
        .catch(error => {
          console.error('Error fetching tours:', error)
          setServerResponse('Error fetching tours');
          setLoadSuccess(false);
    });
      setLoading(false);
      console.log('Server Response:', serverResponse);
    }, []);

    // useEffect(()=>{
    //   // const options = {
    //   //   method: 'GET',
    //   //   url: 'https://world-tourist-attractions-api.p.rapidapi.com/state',
    //   //   headers: {
    //   //     'x-rapidapi-key': '408ea1d5afmsh40df0fafe72f2bep1f123fjsn3d517c12bcb1',
    //   //     'x-rapidapi-host': 'world-tourist-attractions-api.p.rapidapi.com'
    //   //   }
    //   // };
      
    //   // async function fetchData() {
    //   //   try {
    //   //     const response = await axios.request(options);
    //   //     console.log(response.data);
    //   //   } catch (error) {
    //   //     console.error(error);
    //   //   }
    //   // }
      
    //   // fetchData();
    
      

    //   const options = {
    //     method: 'GET',
    //     url: 'https://global-travel-data-api.p.rapidapi.com/live-flights',
    //     params: {country: 'Germany'},
    //     headers: {
    //       'x-rapidapi-key': '4f23d46efamsha6385b13fc91306p14cbf2jsna527df27137e',
    //       'x-rapidapi-host': 'global-travel-data-api.p.rapidapi.com'
    //     }
    //   };
      
    //   async function fetchData() {
    //     try {
    //       const response = await axios.request(options);
    //       console.log(response.data);
    //       setExternalData(response.data)
    //     } catch (error) {
    //       console.error(error);
    //     }
    //   }
      
    //   fetchData();
    
      
    // },[])

    




  
    return (
      <div className="container mx-auto p-6">
        <h2 className="text-4xl font-bold text-gray-800 mb-10 text-center">Explore All Tours</h2>
  
        {/* Filters Section */}
        <div className="bg-white p-8 rounded-2xl shadow-xl mb-10 border border-gray-100">
          <h3 className="text-2xl font-semibold text-gray-700 mb-6">Filter Tours</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                id="location"
                name='location'
                onChange={onFilterChangeHandler}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                placeholder="e.g., Japan"
              />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
              <input
                type="number"
                id="price"
                name='price'
                onChange={onFilterChangeHandler}
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                placeholder="e.g., 1500"
              />
            </div>
            <div>
              <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">Min Rating</label>
              <select
                id="rating"
                name='rating'
                onChange={onFilterChangeHandler}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 shadow-sm bg-white"
              >
                <option value="">Any</option>
                <option value="4">4 Stars & Up</option>
                <option value="4.5">4.5 Stars & Up</option>
              </select>
            </div>
          </div>
          <div className="text-right mt-8">
            <button onClick={()=>setFilteredTours(()=>{
              return tours.filter(tour => {
                const matchesLocation = filterdata.location ? tour.location.toLowerCase().includes(filterdata.location.toLowerCase()) : true;
                const matchesPrice = filterdata.price ? parseFloat(tour.price.replace('$', '')) <= parseFloat(filterdata.price) : true;
                const matchesRating = filterdata.rating ? tour.rating >= parseFloat(filterdata.rating.toString()) : true;
                return matchesLocation && matchesPrice && matchesRating;
              });
            })} className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition duration-300 font-medium shadow-md transform hover:scale-105">
              Apply Filters
            </button>
          </div>
        </div>
  
        {/* Tours Listing */}
        {
          loading ? (
            <SmallLoadingSpinner/>
          ) : (
            <>
            {
              loadSuccess ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTours.map(tour => (
            <div key={tour._id} className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl border border-gray-100">
              <img src={tour.imageUrl} alt={tour.title} className="w-full h-52 object-cover rounded-t-2xl" />
              <div className="p-6">
                <h4 className="text-2xl font-semibold text-gray-800 mb-3">{tour.title}</h4>
                <div style={{float:"right"}} className="flex items-center gap-2 text-base font-medium text-gray-700">
      <UserCircle2 className="w-5 h-5 text-blue-600" />
      <p className="capitalize">{tour.providerName}</p>
    </div>
                <p className="text-gray-600 mb-2 flex items-center"><MapPin size={18} className="mr-2 text-blue-500" /> {tour.location}</p>
                <p className="text-gray-600 mb-4 flex items-center"><Award size={18} className="mr-2 text-yellow-500" /> {tour.rating} Stars</p>
                <div className="flex justify-between items-center">
                  <span className="text-blue-700 font-bold text-3xl flex items-center"><DollarSign size={24} className="mr-1" />{tour.price.toString().replace('ETB', '')}</span>
                  <button
                      onClick={() => {
                         navigate('/tours/'+tour._id);
                         onNavigate('tour-details', { tourId: tour._id })
                         handleViewDetails(tour._id);}}
                      className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition duration-300 font-medium shadow-md"
                    >
                      View Details
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
              ) : (
                <div className="text-center text-red-600 text-xl mb-6">{serverResponse}</div>
              )
            }
            </>
          )
        }
        
        
      </div>
    );
  };

export default TourListingPage
