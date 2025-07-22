// import SwapRequest from "../models/SwapRequest";
import express from "express"
import SwapRequest from "../models/SwapRequest.js";
import Booking from "../models/Booking.js";
import TourSwap from "../models/SwapRequest.js";
import authMiddleware from "../middlewear/auth.js";
import User from "../models/User.js";
import verifyToken from "../middlewear/verifyToken.js";


const router = express.Router();


  // outgoing
  router.post("/outgoing",verifyToken, async (req, res) => {
    console.log("swap requested")
    const { offeredTour, requestedTour, message, requesterId, requesterName } = req.body;
    const currentUserId = req.user.userId;
    const currentUserName = req.user.name;
    const currentUserEmail = req.user.email;

    if (!offeredTour || !offeredTour.bookingId || !requestedTour || !requestedTour.id) {
      return res.status(400).json({ success: false, message: "Error: Missing required swap data." });
    }
    if(requesterId != currentUserId){
      return res.status(400).json({ success: false, message: "Error: Unauthorized user!." });
     
    }

    try {
      const requesterBooking = await Booking.findOne({
        _id: offeredTour.bookingId,
        userId: requesterId,
        status: "Confirmed"
      });
  
      if (!requesterBooking) {
        return res.status(400).json({ success: false, message: "The tour you are offering does not exist, is not confirmed, or does not belong to you." });
      }
      // TODO: Add more validation for requesterBooking (e.g., not already in a pending swap)
  
      const prevRequests = await TourSwap.find({
        status: 'Pending', // Filter for pending requests
        'requester.userId':requesterId,
        'requestedTour.id':requestedTour.id 
      })
     
      if(prevRequests.length != 0){
        return res.status(400).json({ success: false, message: "You've already requested this tour before!" });
     
      }


      const potentialTargetBookings = await Booking.find({
        tourId:{_id: requestedTour.id},
        status: "Confirmed",
        // TODO: Add check for not already in swap: swapStatus: { $ne: 'pending_swap' }
      });
  
      if (potentialTargetBookings.length === 0) {
      return res.status(404).json({ success: false, message: "No available tours found to swap for your requested tour at the moment." });
      }

  
      const createdSwapRequests = [];
  
        const newSwapRequest = await TourSwap.create({
          requester: { userId: requesterId, name: requesterName, email:currentUserEmail },
          // recipient: { userId: targetRecipientUser._id.toString(), name: targetRecipientUser.name },
          offeredTour: {
            id: offeredTour.id,
            title: offeredTour.title,
            date: offeredTour.date,
            price: offeredTour.price,
            bookingId: offeredTour.bookingId
          },
          requestedTour: {
            id: requestedTour.id,
            title: requestedTour.title,
            location: requestedTour.location,
            price: requestedTour.price,
            date: requestedTour.date
          },
          // targetedTourBooking: {
          //   id: targetBooking._id.toString(),
          //   title: targetBooking.name,
          //   date: targetBooking.date,
          //   price: targetBooking.price,
          // },
          message: message,
          status: 'Pending',
        });
  
        createdSwapRequests.push(newSwapRequest);
  
      //   // TODO: Update the status/swapStatus of both requesterBooking and targetBooking
      //   //       in your Booking model to indicate they are now 'pending_swap'.
      //   // TODO: Send notifications to the recipient (e.g., email, in-app notification).
      // }
  
      if (createdSwapRequests.length > 0) {
        res.status(201).json({
          success: true,
          message: `Swap request initiated. ${createdSwapRequests.length} potential swap offers sent.`,
          requests: createdSwapRequests
        });
      } else {
       res.status(404).json({ success: false, message: 'No suitable recipients found for this swap request after processing.' });
      }
  
    } catch (error) {
      console.error('Error creating swap request:', error);
      if (error.name === 'ValidationError') {
        return res.status(400).json({ success: false, message: error.message });
      }
      res.status(500).json({ success: false, message: 'Server error: Could not process swap request.' });
    }
  });

  // for incoming swap rquest
  router.get('/incoming/:userId', verifyToken, async (req, res) => {
    // const currentUserId = req.user.id; // Get authenticated user's ID from middleware
  const {userId} = req.params;
    console.log(`--- Received GET /api/swap-requests/incoming for user: --`);
    if(userId != req.user.userId){
      return res.status(400).json({ success: false, message: "Error: Unauthorized user!." });
     
    }
    try {
      // Find swap requests where the current user is the recipient

      const myBookings = await Booking.find({
        userId,
        status:"Confirmed"
      })
      if(!myBookings){
        res.status(400).json({ message: "You don't have any bookings!" });
    
      }
      const incomingSwap = [];

      // and the status is 'Pending' (as these are the ones usually requiring action).
      // You can adjust the status filter based on your UI needs (e.g., show all, or only accepted/rejected for history).
      const incomingRequests = await TourSwap.find({
        status: 'Pending' // Filter for pending requests
      }).sort({ createdAt: -1 }); // Sort by most recent first

      for(let i =0;i<myBookings.length;i++){
       
         for(let j=0;j<incomingRequests.length;j++){
          if(myBookings[i].tourId == incomingRequests[j].requestedTour.id){
            incomingSwap.push(incomingRequests[i]);
           }
         }
      }
  
      console.log(`Found ${incomingSwap.length} incoming swap requests for user ${userId}.`);
  
      res.status(200).json({
        success: true,
        message: 'Incoming swap requests fetched successfully.',
        
        requests: incomingSwap
      });
  
    } catch (error) {
      console.error('Error fetching incoming swap requests:', error);
      res.status(500).json({ success: false, message: 'Server error: Could not fetch incoming swap requests.' });
    }
  });


  export default router;