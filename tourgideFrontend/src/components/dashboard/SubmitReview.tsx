import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios'; // For conceptual API calls
import { Star, Loader2, Send, X } from 'lucide-react';
import { StoreContext } from '../../context/StoreContext';

// --- Axios Instance Setup (Conceptual - In a real app, this would be in a separate file) ---
const api = axios.create({
  baseURL: 'http://localhost:3001/api', // IMPORTANT: Replace with your actual backend API base URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request Interceptor: Automatically attach the Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userAuthToken'); // Assuming a user token for the main app
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Review Modal Component ---
const ReviewModal = ({ isOpen, onClose, onSubmit, tour }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    // Reset form when modal opens for a new tour
    if (isOpen) {
      setRating(0);
      setComment('');
      setSubmitError(null);
    }
  }, [isOpen, tour]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    if (rating === 0) {
      setSubmitError('Please provide a star rating.');
      setIsSubmitting(false);
      return;
    }

    try {
      await onSubmit(tour.id, rating, comment);
      onClose(); // Close modal on successful submission
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-3xl p-6 sm:p-8 w-full max-w-md transform scale-95 animate-scale-in relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition duration-200">
          <X size={24} />
        </button>
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Write Review for {tour.title}</h3>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
            <div className="flex justify-center space-x-1">
              {[1, 2, 3, 4, 5].map((starValue) => (
                <Star
                  key={starValue}
                  size={36}
                  className={`cursor-pointer transition-colors duration-200
                    ${starValue <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                  onClick={() => setRating(starValue)}
                />
              ))}
            </div>
            {rating === 0 && <p className="text-red-500 text-xs mt-1 text-center">Please select a rating.</p>}
          </div>

          <div>
            <label htmlFor="review-comment" className="block text-sm font-medium text-gray-700 mb-2">Your Comment (Optional)</label>
            <textarea
              id="review-comment"
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition duration-300 shadow-sm resize-none"
              placeholder="Share your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={isSubmitting}
            ></textarea>
          </div>

          {submitError && <p className="text-red-600 text-sm text-center">{submitError}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-lg hover:bg-blue-700 transition duration-300 shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 size={20} className="animate-spin mr-2" />
            ) : (
              <Send size={20} className="mr-2" />
            )}
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
};


const TravelerReviewsSection = () => {
  const [reviewsToSubmit, setReviewsToSubmit] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedReviewTour, setSelectedReviewTour] = useState(null);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' }); // For success/error messages after modal closes
  const {url,token,userData} = useContext(StoreContext)
    const [bookedTours,setBookedTours] = useState([
      { id: 101, name: 'Paris City Break', date: '2025-09-15', status: 'Confirmed' },
      { id: 102, name: 'Rome Historical Tour', date: '2025-11-20', status: 'Pending' },
      { id: 103, name: 'New York Explorer', date: '2025-08-01', status: 'Completed' },
    ]);
    // const [bookingLoad,setBookingLoad] = useState(false)
  

  // Dummy data for tours that need reviews
  const mockReviewsData = [
    { id: 'tour_japan_food', title: 'Japan Food Tour', date: '2025-06-10' },
    { id: 'tour_egypt_nile', title: 'Egypt Nile Cruise', date: '2025-05-20' },
    { id: 'tour_peru_machu', title: 'Peru Machu Picchu Trek', date: '2025-04-15' },
  ];

  // Function to fetch tours pending review
//   const fetchReviewsToSubmit = async () => {
//     setLoading(true);
//     setError(null);
//     setReviewsToSubmit([]); // Clear previous data
//     try {
//       // In a real app, this would be an API call to your backend
//       // const response = await api.get('/user/reviews-pending');
//       // setReviewsToSubmit(response.data);

//       // --- Mocking API Response for demonstration ---
//       const response = await new Promise(resolve => setTimeout(() => {
//         resolve({ data: mockReviewsData });
//       }, 800)); // Simulate network delay

//       setReviewsToSubmit(response.data);

//     } catch (err) {
//       console.error('Error fetching reviews to submit:', err);
//       setError('Failed to load tours pending review. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

  // Fetch data on component mount
  useEffect(()=>{

    const currentBookings = async ()=>{
        setLoading(true);
        setError(null);
        setReviewsToSubmit([]);
      try {
        const response = await axios.get(url+"/api/bookings/user/"+userData.userId);
        
        if(response.data.success){
        setBookedTours(response.data.booking)
        setReviewsToSubmit(response.data.booking.filter(bk=>bk.status === "Completed"));
        
        
        }
        
      } catch (error) {
        console.log("Error fetching recent bookings", error)
        setError('Failed to load tours pending review. Please try again.');
   
      }finally {
        setLoading(false);
      }
    }
    currentBookings();

  },[])

  const handleWriteReviewClick = (tour) => {
    setSelectedReviewTour(tour);
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmit = async (tourId, rating, comment) => {
    try {
      console.log(`Submitting review for tour ${tourId}: Rating ${rating}, Comment: "${comment}"`);
      // In a real app, this would be an API call to your backend
      // await api.post('/reviews', { tourId, rating, comment });

      // Simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSubmitMessage({ type: 'success', text: `Review for "${selectedReviewTour.title}" submitted successfully!` });
      // Remove the reviewed tour from the list
      setReviewsToSubmit(prev => prev.filter(tour => tour.id !== tourId));

    } catch (err) {
      console.error('Error submitting review:', err);
      setSubmitMessage({ type: 'error', text: `Failed to submit review for "${selectedReviewTour.title}".` });
      throw new Error('Review submission failed.'); // Re-throw to be caught by modal's handleSubmit
    }
  };

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setSelectedReviewTour(null);
  };
   // changing the ISO date to regular
   const toReadableDate = (dateString)=>{

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formated = new Date(dateString).toLocaleDateString('en-US', options);

    return formated;

  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
     
      <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 flex items-center">
        <Star size={28} className="mr-3 text-yellow-600" /> Submit Reviews
      </h3>

      {submitMessage.text && (
        <div className={`p-4 rounded-lg mb-6 text-center text-sm sm:text-base ${
          submitMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {submitMessage.text}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <Loader2 size={32} className="animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-700 text-lg">Loading tours pending review...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8 bg-red-50 rounded-xl shadow-sm border border-red-200">
          <p className="text-red-700 text-lg font-medium mb-2">Error:</p>
          <p className="text-red-600">{error}</p>
        </div>
      ) : reviewsToSubmit.length > 0 ? (
        <ul className="space-y-4">
          {reviewsToSubmit.map(review => (
            <li key={review._id} className="bg-gray-50 p-5 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-sm hover:shadow-md transition duration-200 border border-gray-100">
              <div className="flex-1 mb-2 sm:mb-0">
                <p className="font-medium text-lg sm:text-xl text-gray-900">{review.tourId.title}</p>
                <p className="text-sm text-gray-600">Completed on: {toReadableDate(review.updatedAt)}</p>
              </div>
              <button
                onClick={() => handleWriteReviewClick(review)}
                className="mt-3 sm:mt-0 bg-yellow-500 text-white px-5 py-2 rounded-lg hover:bg-yellow-600 transition duration-300 font-medium shadow-sm flex items-center justify-center text-sm sm:text-base transform hover:scale-105"
              >
                <Star size={18} className="mr-2" /> Write Review
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 text-base sm:text-lg text-center py-6 sm:py-8">No tours pending review at the moment. Enjoy your next adventure!</p>
      )}

      {selectedReviewTour && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={closeReviewModal}
          onSubmit={handleReviewSubmit}
          tour={selectedReviewTour}
        />
      )}
    </div>
  );
};

export default TravelerReviewsSection;
