import express from "express";
import Booking from "../models/Booking.js";
import authMiddleware from "../middlewear/auth.js";
import Tour from "../models/Tour.js";
import verifyToken from "../middlewear/verifyToken.js";
 

const router = express.Router();

router.post("/", authMiddleware(["user"]), async (req, res) => {
  console.log("Incoming booking payload:", req.body);
  
  try {
    const booking = await Booking.create(req.body);
    const tourId = req.body.tourId;
    const newBook = await Tour.findOneAndUpdate(
      { _id: tourId },                   // filter
      { $inc: { bookings: 1} },  // update
      { new: true }                      // options: return the updated document
    );
    if (!newBook) {
      throw new Error("Tour not found");
    }
    await newBook.save();
    
    res.status(201).json({message: "booking Succsesfull",booking});
  } catch (error) {
    console.error("Booking failed:", error);
    res.status(400).json({ message: "Booking failed", error });
  }
});

// for users
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    
    const booking = await Booking.find({userId}).populate('tourId','title').populate('providerId','name');
    res.status(200).json({success:true,booking});
  } catch (error) {
    console.error("Error getting bookig:", error.message);
    res.status(500).json({ message: "Error retrieving bookings" });
  }
});

// for providers
router.get("/provider/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const booking = await Booking.find({providerId:userId}).populate('tourId','title').populate('providerId','name');
    res.status(200).json({success:true, booking});
  } catch (error) {
    console.error("Error getting bookig:", error.message);
    res.status(500).json({ message: "Error retrieving bookings" });
  }
});

// Updating booking status
router.put("/status/:userId",verifyToken, async (req,res)=>{
  const { userId } = req.params;
  const {currentStatus, bookId} = req.body;
 
  try {
  const updatedBooking = await Booking.findOneAndUpdate(
      { _id: bookId, providerId: userId }, // Filter to find the specific booking
      { status: currentStatus },          // The update to apply
      { new: true, runValidators: true }  // Options:
                                          // new: true returns the updated document
                                          // runValidators: true ensures schema validations run on update
  );

  if (!updatedBooking) {
      // If updatedBooking is null, it means no document matched the filter
      return res.status(404).json({ success: false, message: "Booking not found or does not belong to this provider. " });
  }

  res.json({ success: true, message: "Booking status updated successfully! "+currentStatus });

} catch (error) {
  console.error("Error updating booking status:", error);
  // Handle Mongoose validation errors or other database errors
  if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message });
  }
  res.status(500).json({ success: false, message: "Server error: Could not update booking status." });
}
})




export default router;
