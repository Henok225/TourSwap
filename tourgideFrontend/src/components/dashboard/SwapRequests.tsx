
import { Repeat, CheckCircle, XCircle, MessageSquare, BookOpen, ArrowRightCircle, Eye } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import CustomAlert from '../prompts/AlertPrompt';
import SmallLoadingSpinner from '../loaderSpin/SmallLoader';

const TravelerSwapRequestsSection = () => {
  const {bookedTours, url, token, userData, toReadableDate} = useContext(StoreContext)
  const [loadingSwaps,setLoadingSwaps] = useState(false);
  const [swapFetchingMessage,setSwapFetchingMessage] = useState('')
  const myBookedTours = bookedTours;
  const [allSwapRequests,setAllSwapRequest] = useState( []);
  const [updateSwapRequest,setUpdateSwapRequest] = useState(false)

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertTitle, setAlertTitle] = useState('Heads Up!');
  const [alertType, setAlertType] = useState('info');
  const [alertDuration, setAlertDuration] = useState(0); // 0 for no auto-close

  const showAlert = (message, title = 'Notification', type = 'info', duration = 0) => {
    setAlertMessage(message);
    setAlertTitle(title);
    setAlertType(type);
    setAlertDuration(duration);
    setIsAlertOpen(true);
  };

  const closeAlert = () => {
    setIsAlertOpen(false);
    setAlertMessage(''); // Clear message when closing
  };
  
  // fetching all swap requests that matches my booked tours
  useEffect(()=>{
   
   const fetchingSwaps = async ()=>{
    try {
      setLoadingSwaps(true)
      const userId = userData.userId;
      const response = await axios.get(url+"/api/swap/incoming/"+userId,{
        headers:{
          "Authorization": "Bearer "+token
        }
      });

      if(response.data.success){
        setAllSwapRequest(response.data.requests)
       }
       console.log(response.data)
       setSwapFetchingMessage(response.data.message)
      setLoadingSwaps(false);
    } catch (error) {
      console.log("Server error: " + error);
      setSwapFetchingMessage("Server error: couldn't fetch swap requests!")
      setLoadingSwaps(false)
    }
   }
   fetchingSwaps();
   

  },[updateSwapRequest])
  


  // Filter swap requests:
  // - Incoming requests: Only show if the 'yourTour.id' matches one of myBookedTours.id
  // - Outgoing requests: Always show if 'offeredTour.id' matches one of myBookedTours.id (meaning it's a request I sent)
  // const filteredSwapRequests = allSwapRequests.filter(request => {
  //   if (request.type === 'incoming') {
  //     return myBookedTours.some(myTour => myTour.id === request.yourTour.id);
  //   } else if (request.type === 'outgoing') {
  //     // For outgoing, ensure the tour being offered by the current user is one of their booked tours.
  //     // This is a sanity check; in a real system, outgoing requests would inherently be tied to the user.
  //     return myBookedTours.some(myTour => myTour.id === request.offeredTour.id);
  //   }
  //   return false; // Should not happen with defined types
  // });

  // Placeholder functions for actions
  const handleAccept = async (requestId) => {

    try {
      const response = await axios.put(url+"/api/swap/accept-request", {swapId:requestId},{
        headers:{
          'Authorization': 'Bearer '+token
        }
      })
      if(response.data.success){
      showAlert(response.data.message, "Notification", "info")
      setUpdateSwapRequest(!updateSwapRequest);
      }
      
    } catch (error) {
      console.log("couldn't update accept status")
    }
    // console.log(`Accepted swap request: ${requestId}`);
    // In a real app, you would send an API call to update status and re-fetch data
  };

  // const handleReject = (requestId) => {
  //   console.log(`Rejected swap request: ${requestId}`);
  //   // In a real app, you would send an API call to update status and re-fetch data
  // };

  // const handleCancel = (requestId) => {
  //   console.log(`Cancelled outgoing swap request: ${requestId}`);
  //   // In a real app, you would send an API call to update status and re-fetch data
  // };

  const handleMessage = (userName) => {
     showAlert(`Couldn't open chat with user: ${userName}`, "Notification","info")
     };
  const generateMailtoLink = (recipientEmail, requesterName, offeredTourTitle, requestedTourTitle) => {
    const subject = encodeURIComponent(`Regarding your swap request for ${requestedTourTitle}`);
    const body = encodeURIComponent(
      `Dear ${requesterName},\n\n` +
      `I'm writing regarding your swap request for "${requestedTourTitle}" where you offered your "${offeredTourTitle}".\n\n` +
      `[Your message here - e.g., "I'd like to discuss this further" or "I'm interested in accepting."]\n\n` +
      `Best regards,\n[Your Name]`
    );
    return `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
   
      <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 flex items-center">
        <Repeat size={28} className="mr-3 sm:mr-4 text-purple-600" /> Swap Requests
      </h3>

    {!loadingSwaps ?
     <>
     {allSwapRequests.length > 0 ? (
        <ul className="space-y-4 sm:space-y-6">
          {allSwapRequests.map(request => (
            <li key={request._id} className="bg-gray-50 p-5 sm:p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm hover:shadow-md transition duration-200 border border-gray-100">
              <div className="flex-1 mb-4 md:mb-0 pr-0 md:pr-4">
                {/* incoming requests */}
                  <>
                    <p className="font-semibold text-lg sm:text-xl text-gray-900 mb-1 sm:mb-2">
                      Incoming from: <span className="text-purple-700">{request.requester.name}</span>
                    </p>
                    <div className="text-gray-700 text-sm sm:text-base space-y-1">
                      <p>
                        <span className="font-medium">Offering:</span> {request.offeredTour.title} (<span className="text-blue-600 font-medium">{toReadableDate(request.offeredTour.date)}</span>)
                        <span className="ml-1 sm:ml-2 text-gray-500 text-xs sm:text-sm">({request.offeredTour.price})</span>
                      </p>
                      <p>
                        <span className="font-medium">For Your:</span> {request.requestedTour.title} (<span className="text-blue-600 font-medium">{request.requestedTour.date ? toReadableDate(request.requestedTour.date):"Unknown date!"}</span>)
                        <span className="ml-1 sm:ml-2 text-gray-500 text-xs sm:text-sm">({request.requestedTour.price})</span>
                      </p>
                    </div>
                  </>
                
                 {/* // Outgoing request */}
                   {/* <> */}
                    {/* <p className="font-semibold text-lg sm:text-xl text-gray-900 mb-1 sm:mb-2"> */}
                {/* //       Outgoing to: <span className="text-purple-700">{request.recipient.name}</span> */}
                     {/* </p>
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
                   </> */}
                 

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

                {request.status === 'Pending' && (
                  <>
                    <button
                      onClick={() => handleAccept(request._id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300 font-medium shadow-md flex items-center justify-center text-sm"
                    >
                      <CheckCircle size={16} className="mr-1 sm:mr-2" /> Accept
                    </button>

                    {/* <button
                      onClick={() => handleReject(request._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300 font-medium shadow-md flex items-center justify-center text-sm"
                    >
                      <XCircle size={16} className="mr-1 sm:mr-2" /> Reject
                    </button> */}
                    
                    
                       <button
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 font-medium shadow-md flex items-center justify-center text-sm"
                    >
                      {
                        request.requester.email ? <a
                        href={generateMailtoLink(
                          request.requester.email,
                          request.requester.name,
                          request.offeredTour.title,
                          request.requestedTour.title
                        )}
                        target="_blank"
                        rel="noopener noreferrer">
                          <MessageSquare size={16} className="mr-1 sm:mr-2" /> Message
                          </a>
                          :<p onClick={() => handleMessage(request.requester.name)} className='flex items-center justify-center text-sm'><MessageSquare size={16} className="mr-1 sm:mr-2" /> Message</p>
                      }
                      
                    </button>
                   
                  </>
                )}

                {/* {request.type === 'outgoing' && request.status === 'Pending' && (
                  <button
                    onClick={() => handleCancel(request.id)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-300 font-medium shadow-md flex items-center justify-center text-sm"
                  >
                    <XCircle size={16} className="mr-1 sm:mr-2" /> Cancel Request
                  </button>
                )} */}

                {/* Optional: View details button for accepted/rejected/cancelled requests */}
                {(request.status === 'Accepted' || request.status === 'Rejected' || request.status === 'Canceled') && (
                  <button
                    onClick={() => console.log(`View details for request: ${request._id}`)}
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
     </>
     : <SmallLoadingSpinner />
    }

<CustomAlert
        isOpen={isAlertOpen}
        message={alertMessage}
        title={alertTitle}
        type={alertType}
        onClose={closeAlert}
        duration={alertDuration}
      />
    </div>
  );
};

export default TravelerSwapRequestsSection;
