
import { Repeat, CheckCircle, XCircle, MessageSquare, BookOpen, ArrowRightCircle } from 'lucide-react';

const TravelerSwapRequestsSection = () => {
  
  const myBookedTours = [
    { id: 'booking_abc123', title: 'Thailand Beaches', date: 'June 1-7, 2026', price: '$1500' },
    { id: 'booking_def456', title: 'Amazon Rainforest Adventure', date: 'July 20-27, 2026', price: '$1500' },
    { id: 'booking_ghi789', title: 'Paris City Break', date: 'Sept 15-20, 2025', price: '$1200' },
  ];

  // Dummy data for all potential swap requests (both incoming and outgoing)
  const allSwapRequests = [
    {
      id: 'req1',
      type: 'incoming', // Explicitly define type for easier rendering
      requester: { name: 'Jane Doe', userId: 'user123' },
      offeredTour: { id: 'tour_offer_bali', title: 'Bali Retreat', date: 'May 10-15, 2026', price: '$1800' },
      yourTour: { id: 'booking_abc123', title: 'Thailand Beaches', date: 'June 1-7, 2026', price: '$1500' }, // Matches myBookedTours ID
      message: 'My plans changed, and your June dates for Thailand would be perfect!',
      status: 'Pending',
    },
    {
      id: 'req2',
      type: 'incoming',
      requester: { name: 'Mark Johnson', userId: 'user456' },
      offeredTour: { id: 'tour_offer_himalayan', title: 'Himalayan Trek', date: 'Sept 1-7, 2026', price: '$2500' },
      yourTour: { id: 'booking_xyz987', title: 'Safari in Serengeti', date: 'Aug 15-22, 2026', price: '$2000' }, // This ID is NOT in myBookedTours
      message: 'Looking to experience the Serengeti! Hope this works for you.',
      status: 'Pending',
    },
    {
      id: 'req3',
      type: 'outgoing', // Explicitly define type
      recipient: { name: 'Sarah Lee', userId: 'user789' }, // Recipient of outgoing request
      offeredTour: { id: 'booking_ghi789', title: 'Paris City Break', date: 'Sept 15-20, 2025', price: '$1200' }, // Your tour you are offering
      desiredTour: { id: 'tour_desire_rome', title: 'Rome Historical Tour', date: 'Oct 1-7, 2025', price: '$1300' }, // Tour you desire
      message: 'I\'d love to swap my Paris trip for your Rome tour if you\'re interested!',
      status: 'Pending',
    },
    {
      id: 'req4',
      type: 'incoming',
      requester: { name: 'David Kim', userId: 'user101' },
      offeredTour: { id: 'tour_offer_vietnam', title: 'Vietnam Cultural Journey', date: 'Nov 1-10, 2026', price: '$2000' },
      yourTour: { id: 'booking_def456', title: 'Amazon Rainforest Adventure', date: 'July 20-27, 2026', price: '$1500' }, // Matches myBookedTours ID
      message: 'Always wanted to see the Amazon! My Vietnam trip is available.',
      status: 'Pending',
    },
  ];

  // Filter swap requests:
  // - Incoming requests: Only show if the 'yourTour.id' matches one of myBookedTours.id
  // - Outgoing requests: Always show if 'offeredTour.id' matches one of myBookedTours.id (meaning it's a request I sent)
  const filteredSwapRequests = allSwapRequests.filter(request => {
    if (request.type === 'incoming') {
      return myBookedTours.some(myTour => myTour.id === request.yourTour.id);
    } else if (request.type === 'outgoing') {
      // For outgoing, ensure the tour being offered by the current user is one of their booked tours.
      // This is a sanity check; in a real system, outgoing requests would inherently be tied to the user.
      return myBookedTours.some(myTour => myTour.id === request.offeredTour.id);
    }
    return false; // Should not happen with defined types
  });

  // Placeholder functions for actions
  const handleAccept = (requestId) => {
    console.log(`Accepted swap request: ${requestId}`);
    // In a real app, you would send an API call to update status and re-fetch data
  };

  const handleReject = (requestId) => {
    console.log(`Rejected swap request: ${requestId}`);
    // In a real app, you would send an API call to update status and re-fetch data
  };

  const handleCancel = (requestId) => {
    console.log(`Cancelled outgoing swap request: ${requestId}`);
    // In a real app, you would send an API call to update status and re-fetch data
  };

  const handleMessage = (userId) => {
    console.log(`Open chat with user: ${userId}`);
    // In a real app, this would navigate to a chat interface or open a chat modal.
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
   
      <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 flex items-center">
        <Repeat size={28} className="mr-3 sm:mr-4 text-purple-600" /> Swap Requests
      </h3>

      {filteredSwapRequests.length > 0 ? (
        <ul className="space-y-4 sm:space-y-6">
          {filteredSwapRequests.map(request => (
            <li key={request.id} className="bg-gray-50 p-5 sm:p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm hover:shadow-md transition duration-200 border border-gray-100">
              <div className="flex-1 mb-4 md:mb-0 pr-0 md:pr-4">
                {request.type === 'incoming' ? (
                  <>
                    <p className="font-semibold text-lg sm:text-xl text-gray-900 mb-1 sm:mb-2">
                      Incoming from: <span className="text-purple-700">{request.requester.name}</span>
                    </p>
                    <div className="text-gray-700 text-sm sm:text-base space-y-1">
                      <p>
                        <span className="font-medium">Offering:</span> {request.offeredTour.title} (<span className="text-blue-600 font-medium">{request.offeredTour.date}</span>)
                        <span className="ml-1 sm:ml-2 text-gray-500 text-xs sm:text-sm">({request.offeredTour.price})</span>
                      </p>
                      <p>
                        <span className="font-medium">For Your:</span> {request.yourTour.title} (<span className="text-blue-600 font-medium">{request.yourTour.date}</span>)
                        <span className="ml-1 sm:ml-2 text-gray-500 text-xs sm:text-sm">({request.yourTour.price})</span>
                      </p>
                    </div>
                  </>
                ) : ( // Outgoing request
                  <>
                    <p className="font-semibold text-lg sm:text-xl text-gray-900 mb-1 sm:mb-2">
                      Outgoing to: <span className="text-purple-700">{request.recipient.name}</span>
                    </p>
                    <div className="text-gray-700 text-sm sm:text-base space-y-1">
                      <p>
                        <span className="font-medium">You Offered:</span> {request.offeredTour.title} (<span className="text-blue-600 font-medium">{request.offeredTour.date}</span>)
                        <span className="ml-1 sm:ml-2 text-gray-500 text-xs sm:text-sm">({request.offeredTour.price})</span>
                      </p>
                      <p>
                        <span className="font-medium">You Desired:</span> {request.desiredTour.title} (<span className="text-blue-600 font-medium">{request.desiredTour.date}</span>)
                        <span className="ml-1 sm:ml-2 text-gray-500 text-xs sm:text-sm">({request.desiredTour.price})</span>
                      </p>
                    </div>
                  </>
                )}

                {request.message && (
                  <p className="text-gray-600 italic mt-2 sm:mt-3 border-l-4 border-purple-300 pl-2 sm:pl-3 py-1">
                    "{request.message}"
                  </p>
                )}
              </div>

              <div className="flex flex-wrap justify-start sm:justify-end md:justify-end gap-2 sm:gap-3 mt-4 md:mt-0 items-center">
                <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold shadow-sm
                  ${request.status === 'Pending' ? (request.type === 'incoming' ? 'bg-indigo-100 text-indigo-800' : 'bg-orange-100 text-orange-800') :
                    request.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800' // For Rejected/Cancelled
                  }`}>
                  {request.status}
                </span>

                {request.type === 'incoming' && request.status === 'Pending' && (
                  <>
                    <button
                      onClick={() => handleAccept(request.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300 font-medium shadow-md flex items-center justify-center text-sm"
                    >
                      <CheckCircle size={16} className="mr-1 sm:mr-2" /> Accept
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300 font-medium shadow-md flex items-center justify-center text-sm"
                    >
                      <XCircle size={16} className="mr-1 sm:mr-2" /> Reject
                    </button>
                    <button
                      onClick={() => handleMessage(request.requester.userId)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 font-medium shadow-md flex items-center justify-center text-sm"
                    >
                      <MessageSquare size={16} className="mr-1 sm:mr-2" /> Message
                    </button>
                  </>
                )}

                {request.type === 'outgoing' && request.status === 'Pending' && (
                  <button
                    onClick={() => handleCancel(request.id)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-300 font-medium shadow-md flex items-center justify-center text-sm"
                  >
                    <XCircle size={16} className="mr-1 sm:mr-2" /> Cancel Request
                  </button>
                )}

                {/* Optional: View details button for accepted/rejected/cancelled requests */}
                {(request.status === 'Accepted' || request.status === 'Rejected' || request.status === 'Canceled') && (
                  <button
                    onClick={() => console.log(`View details for request: ${request.id}`)}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-300 font-medium shadow-sm flex items-center justify-center text-sm"
                  >
                    <Eye size={16} className="mr-1 sm:mr-2" /> View Details
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 text-base sm:text-lg text-center py-6 sm:py-8">No swap requests at the moment.</p>
      )}
    </div>
  );
};

export default TravelerSwapRequestsSection;
