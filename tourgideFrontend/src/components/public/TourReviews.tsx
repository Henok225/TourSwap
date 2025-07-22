import axios from 'axios';
import { Star, MessageSquare } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import SmallLoadingSpinner from '../loaderSpin/SmallLoader';

// --- TourReviewsSection Component (copied from your latest version) ---
const TourReviewsSection = ({ tourId }) => {
  
  const {url} = useContext(StoreContext);
  const [tourReviws,setTourReviews] = useState([]);
  const [message,setMessage] = useState("");
  const [loading,setLoading] = useState(false)
    const dummyReviews = [
    {
      _id: 'rev1',
      tourId: 'tour_abc123', // Ensure this matches a tourId you're testing with
      userId: 'user1',
      author: 'Alice Wonderland',
      rating: 5,
      comment: 'Absolutely breathtaking! The guides were incredibly knowledgeable and the wildlife spotting was incredible. A trip of a lifetime! Highly recommend for nature lovers.',
      createdAt: '2024-07-15T10:30:00Z'
    },
    {
      _id: 'rev2',
      tourId: 'tour_abc123',
      userId: 'user2',
      author: 'Bob The Explorer',
      rating: 4,
      comment: 'A truly unique experience. A bit humid, but worth it! The eco-lodge was comfortable and the food was surprisingly good. Lost a star for the mosquitos!',
      createdAt: '2024-07-12T14:00:00Z'
    },
    {
      _id: 'rev3',
      tourId: 'tour_def456', // Different tourId to show filtering
      userId: 'user3',
      author: 'Charlie Adventures',
      rating: 5,
      comment: 'Incredible journey! Every day was an adventure. From the river cruises to the jungle treks, everything was perfectly organized. Would do it again!',
      createdAt: '2024-07-10T09:15:00Z'
    },
    {
      _id: 'rev4',
      tourId: 'tour_abc123',
      userId: 'user4',
      author: 'Diana Globetrotter',
      rating: 3,
      comment: 'Decent experience overall. The tour felt a bit rushed at times, and the wildlife sightings were not as frequent as I hoped. Still, glad I went.',
      createdAt: '2024-07-08T18:45:00Z'
    },
    {
      _id: 'rev5',
      tourId: 'tour_abc123',
      userId: 'user5',
      author: 'Eve Wanderlust',
      rating: 4,
      comment: 'Fantastic trip with amazing guides. Learned so much about the ecosystem. The only minor issue was the internet connectivity at the lodge, but that\'s expected in the Amazon!',
      createdAt: '2024-07-05T11:00:00Z'
    }
  ];

  useEffect(()=>{
    const fetchReviews = async ()=>{
      try {
        setLoading(true)
        const response = await axios.get(url+"/api/tours/reviews/list");
      if(response.data.success){
        setTourReviews(response.data.reviews);
        setMessage(response.data.message);
      }
      } catch (error) {
        console.log("Couldn't fetche reviews")
        setMessage("Couldn't fetch reviews!")
        setLoading(false)
      }
    }
    fetchReviews();
  },[])

  // Filter  data based on the tourId prop
  const reviews = tourReviws.filter(review => review.tourId === tourId);

  return (
    <section className="mt-8 sm:mt-12 bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border border-gray-100">
      <h3 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-8 border-b-2 border-blue-200 pb-4 flex items-center">
        <Star size={32} className="mr-3 text-yellow-500 fill-yellow-500" />
        Customer Reviews ({reviews.length})
      </h3>

      {
        !loading ? <SmallLoadingSpinner />
        :<>
        {reviews.length > 0 ? (
        // <div className="space-y-8">
         <> {reviews.map(review => (
            <div key={review._id} className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200 transition-all duration-200 hover:shadow-lg hover:bg-gray-100 ">
              <div className="flex items-center justify-between mb-4 flex-wrap">
                <div className="flex items-center">
                  <span className="font-bold text-xl text-gray-900 mr-3">{review.author || 'Anonymous'}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={22}
                        className={`${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed text-base md:text-lg border-l-4 border-blue-400 pl-4 py-1">
                "{review.comment}"
              </p>
            </div>
          ))}
       </> // </div>
      ) : (
        <p className="text-gray-600 text-lg text-center py-8">
          No reviews yet for this tour. Be the first to share your experience!
        </p>
      )}
        </>
      }
    </section>
  );
};

export default TourReviewsSection;
