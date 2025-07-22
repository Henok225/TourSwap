import { useState, useEffect, useContext } from 'react';
import {   Repeat, MapPin, DollarSign,  X, Loader2 } from 'lucide-react';
import { StoreContext } from '../../context/StoreContext';



// --- NEW: Swap Confirmation Modal Component ---
const SwapConfirmationModal = ({ isOpen, onClose, requestedTour, myBookedTours, onConfirmSwap }) => {
    const [selectedOfferedBookingId, setSelectedOfferedBookingId] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });
    const {userData, toReadableDate} = useContext(StoreContext) 
  
    // Reset form when modal opens for a new requested tour
    useEffect(() => {
      if (isOpen) {
        setSelectedOfferedBookingId('');
        setMessage('');
        setSubmitMessage({ type: '', text: '' });
      }
    }, [isOpen, requestedTour]);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setSubmitMessage({ type: '', text: '' });
  
      if (!selectedOfferedBookingId) {
        setSubmitMessage({ type: 'error', text: 'Please select one of your tours to offer.' });
        return;
      }
  
      setIsSubmitting(true);
      try {
        const offeredTourBooking = myBookedTours.find(b => b.tourId._id === selectedOfferedBookingId);
        if (!offeredTourBooking) {
          console.log("Selected offered tour not found in your bookings")
          throw new Error('Selected offered tour not found in your bookings.');
        }
        
        
        // Collect all necessary data
        const swapData = {
           requesterId: userData.userId, 
          requesterName: userData.username, 
  
          // The tour the requester is offering (from their booked tours)
          offeredTour: {
            id: offeredTourBooking.tourId._id, // Assuming booked tour has a tourId reference
            bookingId: offeredTourBooking._id, // The specific booking ID
            title: offeredTourBooking.tourId.title,
            date: offeredTourBooking.updatedAt,
            price: offeredTourBooking.price || '$XXX' 
          },
          // The tour the requester wants (the one they clicked on)
          requestedTour: {
            id: requestedTour._id, // The general tour ID from the listing
            title: requestedTour.title,
            location: requestedTour.location,
            price: requestedTour.price
          },
          message: message,
        };
  
        await onConfirmSwap(swapData);
        setSubmitMessage({ type: 'success', text: 'Swap request sent successfully! You will be notified of updates.' });
        // Optionally close modal after a short delay or user action
        setTimeout(() => onClose(), 2000);
  
      } catch (err) {
        console.error('Error sending swap request:', err);
        setSubmitMessage({ type: 'error', text: err.message || 'Failed to send swap request. Please try again.' });
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
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Initiate Swap for "{requestedTour.title}"</h3>
  
          <div className="bg-blue-50 p-4 rounded-xl mb-6 border border-blue-100">
            <p className="text-blue-800 font-semibold text-lg mb-2">You are requesting:</p>
            <p className="text-blue-700 text-base flex items-center"><MapPin size={18} className="mr-2" /> {requestedTour.title} in {requestedTour.location}</p>
            <p className="text-blue-700 text-base flex items-center"><DollarSign size={18} className="mr-2" /> {requestedTour.price}</p>
          </div>
  
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="offered-tour-select" className="block text-sm font-medium text-gray-700 mb-2">
                Select YOUR tour to offer in exchange:
              </label>
              <select
                id="offered-tour-select"
                value={selectedOfferedBookingId}
                onChange={(e) => setSelectedOfferedBookingId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition duration-300 shadow-sm bg-white disabled:bg-gray-100"
                disabled={isSubmitting}
              >
                <option value="">-- Choose your tour --</option>
                {myBookedTours.length > 0 ? (
                  myBookedTours.map(tour => (
                    <option key={tour.tourId._id} value={tour.tourId._id}>
                      {tour.tourId.title} (Booked: {toReadableDate(tour.updatedAt)})
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No tours available to swap</option>
                )}
              </select>
              {!selectedOfferedBookingId && submitMessage.type === 'error' && (
                <p className="text-red-500 text-xs mt-1">{submitMessage.text}</p>
              )}
            </div>
  
            <div>
              <label htmlFor="swap-message" className="block text-sm font-medium text-gray-700 mb-2">
                Your message to the recipient (optional):
              </label>
              <textarea
                id="swap-message"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition duration-300 shadow-sm resize-none disabled:bg-gray-100"
                placeholder="e.g., 'My plans changed, would love to swap for this tour!'"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isSubmitting}
              ></textarea>
            </div>
  
            {submitMessage.text && submitMessage.type !== 'error' && ( // Display success message
              <p className={`text-center p-3 rounded-lg ${submitMessage.type === 'success' ? 'bg-green-100 text-green-800' : ''}`}>
                {submitMessage.text}
              </p>
            )}
  
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold text-lg hover:bg-indigo-700 transition duration-300 shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={isSubmitting || !selectedOfferedBookingId}
            >
              {isSubmitting ? (
                <Loader2 size={20} className="animate-spin mr-2" />
              ) : (
                <Repeat size={20} className="mr-2" />
              )}
              {isSubmitting ? 'Sending Request...' : 'Confirm Swap'}
            </button>
          </form>
        </div>
      </div>
    );
  };
  
  export default SwapConfirmationModal