import express from "express";
 import Tour from "../models/Tour.js";
 import verifyToken from "../middlewear/verifyToken.js";
import Review from "../models/Review.js";
import Booking from "../models/Booking.js";
const router = express.Router();

// 🔹 Submit a tour (protected - provider only)
router.post("/submit", verifyToken, async (req, res) => {
  console.log("📦 Incoming body:", req.body);
  try {
    const newTour = {
      ...req.body,
      providerId: req.body.providerId,
      providerName: req.body.providerName,
    };

    const tour = await Tour.create(newTour);
    res.status(201).json(tour);
  } catch (error) {
    console.error("Error submitting tour:", error.message);
    res.status(400).json({ message: "Error submitting tour", error: error.message });
  }
});

// 🔹 Get all tours (public)
router.get("/", async (req, res) => {
  try {
    const toursO = await Tour.find().populate("providerId", "name email");
    const tours = toursO.filter(tur=>tur.status === "Active");
    res.status(200).json({success:true,tours});
  } catch (error) {
    console.error("Error getting tours:", error.message);
    res.status(500).json({success:false, message: "Error retrieving tours" });
  }
});

// 🔹 Get all tours (Admin)
router.get("/admin",verifyToken, async (req, res) => {
  try {
    const tours = await Tour.find().populate("providerId", "name email");
  
    res.status(200).json({success:true,tours});
  } catch (error) {
    console.error("Error getting tours:", error.message);
    res.status(500).json({success:false, message: "Error retrieving tours" });
  }
});

// ✅ GET all tours by provider
router.get("/provider/:providerId", verifyToken, async (req, res) => {
  const { providerId } = req.params;

  if (!req.user || (req.user.id !== providerId && req.user.role !== "provider")) {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const tours = await Tour.find({ providerId });
    res.status(200).json(tours);
  } catch (error) {
    console.error("Error fetching provider tours:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ UPDATE a tour
router.put("/update/:tourId",verifyToken, async (req, res) => {
  const { tourId } = req.params;
  const { title, location, date, availability,price, status } = req.body;

  try {
    const tour = await Tour.findById(tourId);
    if (!tour) return res.status(404).json({success:false, message: "Tour not found" });

    // if (tour.providerId.toString() !== req.user.id && req.user.role !== "admin") {
    //   return res.status(403).json({ message: "Access denied" });
    // }

    tour.title = title || tour.title;
    tour.location = location || tour.location;
    tour.date = date || tour.date;
   if (availability !== undefined) {
    tour.availability = availability;}
    tour.providerId= tour.providerId;
    tour.providerName= tour.providerName;
    tour.price = price || tour.price;
    tour.status = status || tour.status;
    const updatedTour = await tour.save();
    res.status(200).json(updatedTour);
  } catch (error) {
    console.error("Error updating tour:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ DELETE a tour
router.delete("/remove/:tourId", verifyToken, async (req, res) => {
  const { tourId } = req.params;

  try {
    const tour = await Tour.findById(tourId);
    console.log("tour", tour)
    if (!tour) return res.status(404).json({ message: "Tour not found" });

    // if (tour.providerId.toString() !== req.user.id && req.user.role !== "admin") {
    //   return res.status(403).json({ message: "Access denied" });
    // }

    await tour.deleteOne();
    res.status(200).json({ message: "Tour deleted successfully" });
  } catch (error) {
    console.error("Error deleting tour:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// tours review route

router.post('/reviews', verifyToken, async (req, res) => {
  const { tourId, rating, comment } = req.body;
  const userId = req.user.userId; // Get user ID from authenticated request
  console.log("review sent request")
  // Basic input validation
  if (!tourId || !rating) {
    console.log("rating problem")
    
    return res.status(400).json({ success: false, message: 'Tour ID and rating are required.' });
  }
  if (typeof rating !== 'number' || rating < 1 || rating > 5) {
    return res.status(400).json({ success: false, message: 'Rating must be a number between 1 and 5.' });
    
    
  }
  if (comment && typeof comment !== 'string' || comment.length > 1000) {
   return res.status(400).json({ success: false, message: 'Comment must be a string and not exceed 1000 characters.' });
  }
  

  try {
    // Optional: Validate if the tourId actually exists in your Tour collection
    const tourExists = await Tour.findOne({_id:tourId});
    if (!tourExists) {
      console.log("tour isn't here  : "+ tourId)
      return res.status(404).json({ success: false, message: 'Tour not found.' });
    }

    // Optional: Check if the user has already reviewed this tour (if your schema has unique:true on tourId+userId)
    const existingReview = await Review.findById(userId);
    if (existingReview) {
      console.log("you already submited")
      return res.status(409).json({ success: false, message: 'You have already submitted a review for this tour.' });
    }

    // Create and save the new review
    const newReview = await Review.create({
      tourId,
      userId,
      rating,
      comment: comment || '', // Ensure comment is a string, even if empty
      status: 'pending' // Or 'approved' if no moderation is needed
    });

    // updating booking status
    const updatedBooking = await Booking.findOneAndUpdate(
      { userId, tourId }, // Query to find the specific booking
      { status: "Reviewed" }, // Update the status field
      { new: true } // Return the updated document
    );

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully!',
      review: newReview
    });

  } catch (error) {
    console.error('Error submitting review:', error);
    if (error.name === 'ValidationError') {
      // Mongoose validation errors (e.g., if rating type is wrong despite initial check)
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: 'Server error: Could not submit review.' });
  }
});

// get all reviews

router.get('/reviews/list', async (req, res) => {
  const { tourId, userId, status } = req.query; // Get query parameters

  // Build query object based on provided parameters
  const query = {};
  if (tourId) {
    query.tourId = tourId;
  }
  if (userId) {
    query.userId = userId;
  }
  if (status) {
    query.status = status;
  }

  try {
    // Find reviews based on the constructed query
    const reviews = await Review.find(query).sort({ createdAt: -1 }); // Sort by most recent first

    res.status(200).json({
      success: true,
      message: 'Reviews fetched successfully.',
      reviews: reviews
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ success: false, message: 'Server error: Could not fetch reviews.' });
  }
});

// deleting review

router.delete('/reviews/remove/:id',verifyToken, async (req, res) => {
  const reviewId = req.params.id;
  const userId = req.user.userId; // Authenticated user's ID

  try {
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    // Authorization check: Only the review owner or an admin can delete
    // Assuming req.user.role is set by your authMiddleware for admin checks
    if (review.userId.toString() !== userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this review.' });
    }

    await Review.deleteOne({ _id: reviewId }); // Use deleteOne for clarity

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully.'
    });

  } catch (error) {
    console.error('Error deleting review:', error);
    if (error.name === 'CastError') { // Handle invalid ObjectId format
      return res.status(400).json({ success: false, message: 'Invalid review ID format.' });
    }
    res.status(500).json({ success: false, message: 'Server error: Could not delete review.' });
  }
});


export default router;
