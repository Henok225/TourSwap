// import SwapRequest from "../models/SwapRequest";
import express from "express"
import SwapRequest from "../models/SwapRequest.js";


const router = express.Router();

// for users
router.get("/incoming/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
      
      const swap = await SwapRequest.find({requester:requester[userId]});
      res.status(200).json({success:true,swap});
    } catch (error) {
      console.error("Error getting bookig:", error.message);
      res.status(500).json({ message: "Error retrieving bookings" });
    }
  });

//   router.get('/my-requests', authMiddleware, async (req, res) => {
//     try {
//       const currentUserId = req.user.id;
  
//       const myRequests = await SwapRequest.find({
//         $or: [
//           { 'requester.userId': currentUserId }, // Outgoing requests
//           { 'recipient.userId': currentUserId }  // Incoming requests
//         ]
//       }).sort({ createdAt: -1 }); // Sort by most recent
  
//       // You might want to add logic here to determine 'type: incoming/outgoing' for frontend display
//       // based on `currentUserId` and `requester.userId` / `recipient.userId`
  
//       res.json(myRequests);
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send('Server Error');
//     }
//   });

  export default router;