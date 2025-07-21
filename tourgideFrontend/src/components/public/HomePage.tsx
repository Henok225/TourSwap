// import React from 'react'
import { Home, List, User, Briefcase, LogIn, UserPlus, BookOpen, Repeat, Star, PlusCircle, Edit, Trash2, Eye, MapPin, DollarSign, Award } from 'lucide-react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const HomePage = ({ onNavigate }) => {

    const navigate = useNavigate();
    const featuredTours = [
      { id: 1, name: 'Amazon Rainforest Adventure', location: 'Brazil', price: '$1500', rating: 4.8, imageUrl: 'https://cdn2.rhinoafrica.com/thumbnails/media/_en/destinations/root/africa/east-africa/tanzania/serengeti-and-the-north-of-tanzania/greater-serengeti-ecosystem/serengeti-national-park/_img/gallery/53383/image-thumb__53383__background-cover/field-with-zebras-and-blue-wildebeest_192248950.ed7d5949.jpg' },
      { id: 2, name: 'Kyoto Cherry Blossom Tour', location: 'Japan', price: '$1200', rating: 4.9, imageUrl: 'https://aex-web.imgix.net/getContentAsset/ef7f7138-c9b7-4f1d-bcb3-27fe5be3e673/8e265d97-ee24-47b6-a823-0d8b4ca7c908/Aurora-borealis,-Northern-Lights,-Lofoten-islands,-Norway,-Shutterstock-WEB.jpg?language=en&auto=format&w={width}&fit=cover' },
      { id: 3, name: 'Safari in Serengeti', location: 'Tanzania', price: '$2000', rating: 4.7, imageUrl: 'https://trekthehimalayas.com/images/HomePageImages/Desktop/02efe847-b6f4-49f6-a42b-44997f3c0e46_Himalaya-trek.webp' },
    ];
    const {setTourInView} = useContext(StoreContext)
  
    const handleViewDetails = (tourId) => {
      setTourInView(featuredTours.find(tour => tour.id === tourId));
      localStorage.setItem('tourInView', JSON.stringify(featuredTours.find(tour => tour.id === tourId)));
      navigate('/tours/' + tourId);
      onNavigate('tour-details', { tourId });
    };

    return (
      <div className="container mx-auto p-6">
        <section className="text-center my-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-12 rounded-3xl shadow-2xl animate-fade-in-down">
          <h2 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">Discover Your Next Adventure!</h2>
          <p className="text-xl md:text-2xl mb-10 opacity-90 animate-fade-in-up">Find incredible tours or swap your existing bookings with fellow travelers.</p>
          <button
            onClick={() => {navigate('/tours'), onNavigate(page)}}
            className="bg-yellow-400 text-blue-900 px-10 py-4 rounded-full font-bold text-lg md:text-xl shadow-lg hover:bg-yellow-300 transition duration-300 transform hover:scale-105 animate-bounce-in"
          >
            Explore Tours
          </button>
        </section>
  
        <section className="my-16">
          <h3 className="text-4xl font-bold text-gray-800 mb-10 text-center">Featured Tours</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTours.map(tour => (
              <div key={tour.id} className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl border border-gray-100">
                <img src={tour.imageUrl} alt={tour.name} className="w-full h-52 object-cover rounded-t-2xl" />
                <div className="p-6">
                  <h4 className="text-2xl font-semibold text-gray-800 mb-3">{tour.name}</h4>
                  <p className="text-gray-600 mb-2 flex items-center"><MapPin size={18} className="mr-2 text-blue-500" /> {tour.location}</p>
                  <p className="text-gray-600 mb-4 flex items-center"><Award size={18} className="mr-2 text-yellow-500" /> {tour.rating} Stars</p>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700 font-bold text-3xl flex items-center"><DollarSign size={24} className="mr-1" />{tour.price.replace('$', '')}</span>
                    <button
                      onClick={() => {
                         navigate('/tours/'+tour.id);
                         onNavigate('tour-details', { tourId: tour.id })
                         handleViewDetails(tour.id);}}
                      className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition duration-300 font-medium shadow-md"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  };


export default HomePage
