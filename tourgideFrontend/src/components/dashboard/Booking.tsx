import { useContext, useState } from 'react';
import axios from 'axios'
import { StoreContext } from '../../context/StoreContext';

const Booking = ({setBooking}) => {

  const { url, token, tourInView, userData } = useContext(StoreContext);
  // const [tourId, setTourId] = useState('');
  const [hotelName, setHotelName] = useState('');
  const [hotelAddress, setHotelAddress] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [participants, setParticipants] = useState(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [nationality, setNationality] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [paymentReceipt, setPaymentReceipt] = useState('');
  const [roomType, setRoomType] = useState('');
  const [hotelClass, setHotelClass] = useState('');
  const [additionalRequests, setAdditionalRequests] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  const createBooking = async (data) => {
    setLoading(true);
    setError(null);
    setMessage('');
    try {
      
       await axios.post(`${url}/api/bookings/`, data, {
        headers: {
          'Content-Type': 'application/json',
         ' Authorization': `Bearer ${token}`,
        },
      }); 

      setMessage('Booking successful!');
    } catch (err) {
      setError(`Failed to book: ${err.response?.data?.message || err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!hotelName || !hotelAddress) {
    //   setError('Please fill all required fields.');
    //   return;
    // }

    if(!userData){
      return alert("Please login to your account first!");
    }

    const payload = {
      tourId:tourInView._id, // Demo ID
      bookingDate: bookingDate || new Date().toISOString().split('T')[0],
      participants,
      hotelName,
      hotelAddress,
      fullName,
      email,
      phone,
      nationality,
      passportNumber,
      paymentReceipt,
      roomType,
      hotelClass,
      additionalRequests,
      providerId: tourInView.providerId._id, 
      userId: userData.userId,         
    };

    await createBooking(payload);
    setHotelName('');
    setHotelAddress('');
    setBookingDate('');
    setParticipants(1);
    setFullName('');
    setEmail('');
    setPhone('');
    setNationality('');
    setPassportNumber('');
    setPaymentReceipt('');
    setRoomType('');
    setHotelClass('');
    setAdditionalRequests('');
  };

  return (
    <div style={{  width:'100%', zIndex:'1'}}  className=" min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 font-sans antialiased flex items-center justify-center">
      <div className="max-w-xl w-full bg-white shadow-xl rounded-2xl p-8 space-y-8">

        {loading && (
          <div className="flex items-center justify-center p-4 bg-blue-100 text-blue-700 rounded-lg shadow-md">
            <svg className="animate-spin h-5 w-5 mr-3 text-blue-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </div>
        )}
        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg shadow-md border border-red-200">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}
        {message && (
          <div className="p-4 bg-green-100 text-green-700 rounded-lg shadow-md border border-green-200">
            <p className="font-semibold">Success:</p>
            <p>{message}</p>
          </div>
        )}

        <section className="bg-blue-50 p-6 rounded-xl shadow-inner">
          <h2 className="text-3xl font-bold text-gray-700 mb-6 text-center">Book Your Tour</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* <div>
              <label htmlFor="hotel-name" className="block text-gray-700 text-sm font-medium mb-2">Hotel Name:</label>
              <input
                type="text" id="hotel-name" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                value={hotelName} onChange={(e) => setHotelName(e.target.value)} placeholder="e.g., Grand Hyatt" required
              />
            </div>
            <div>
              <label htmlFor="hotel-address" className="block text-gray-700 text-sm font-medium mb-2">Hotel Address:</label>
              <input
                type="text" id="hotel-address" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                value={hotelAddress} onChange={(e) => setHotelAddress(e.target.value)} placeholder="e.g., 123 Main St, City" required
              />
            </div> */}
            <div>
              <label htmlFor="booking-date" className="block text-gray-700 text-sm font-medium mb-2">Booking Date:</label>
              <input
                type="date" id="booking-date" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label htmlFor="participants" className="block text-gray-700 text-sm font-medium mb-2">Participants:</label>
              <input
                type="number" id="participants" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                value={participants} onChange={(e) => setParticipants(Math.max(1, parseInt(e.target.value) || 1))} min="1"
              />
            </div>
            <div>
              <label htmlFor="full-name" className="block text-gray-700 text-sm font-medium mb-2">Full Name:</label>
              <input
                type="text" id="full-name" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g., John Doe" required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">Email:</label>
              <input
                type="email" id="email" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g., johndoe@gmail.com" required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-gray-700 text-sm font-medium mb-2">Phone:</label>
              <input
                type="tel" id="phone" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g., +251904567890" required
              />
            </div>
            <div>
              <label htmlFor="nationality" className="block text-gray-700 text-sm font-medium mb-2">Nationality:</label>
              <input
                type="text" id="nationality" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                value={nationality} onChange={(e) => setNationality(e.target.value)} placeholder="e.g., Ethiopian" required
              />
            </div>
            <div>
              <label htmlFor="passport-number" className="block text-gray-700 text-sm font-medium mb-2">Passport Number:</label>
              <input
                type="text" id="passport-number" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                value={passportNumber} onChange={(e) => setPassportNumber(e.target.value)} placeholder="e.g., A12345678" required
              />
            </div>
            <div>
              <label htmlFor="payment-receipt" className="block text-gray-700 text-sm font-medium mb-2">Payment Receipt:</label>
              <input
                type="text" id="payment-receipt" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                value={paymentReceipt} onChange={(e) => setPaymentReceipt(e.target.value)} placeholder="e.g., Receipt12345" required
              />
            </div>
            <div>
              <label htmlFor="room-type" className="block text-gray-700 text-sm font-medium mb-2">Room Type:</label>
              <input
                type="text" id="room-type" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                value={roomType} onChange={(e) => setRoomType(e.target.value)} placeholder="e.g., Deluxe Suite" required
              />
            </div>
            <div>
              <label htmlFor="hotel-class" className="block text-gray-700 text-sm font-medium mb-2">Hotel Class:</label>
              <input
                type="text" id="hotel-class" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                value={hotelClass} onChange={(e) => setHotelClass(e.target.value)} placeholder="e.g., 5-Star" required
              />
            </div>
            <div>
              <label htmlFor="additional-requests" className="block text-gray-700 text-sm font-medium mb-2">Additional Requests:</label>
              <textarea
                id="additional-requests" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                value={additionalRequests} onChange={(e) => setAdditionalRequests(e.target.value)} placeholder="e.g., Late check-in, special dietary requirements" rows="3"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white p-3 rounded-lg font-semibold text-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Confirm Booking'}
            </button>
            <button
              type="submit"
              className="w-full bg-red-600 text-white p-3 rounded-lg font-semibold text-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
              onClick={() => setBooking(false)}
            >Cancel</button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Booking;
