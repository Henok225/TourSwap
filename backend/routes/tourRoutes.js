import express from "express";
 import Tour from "../models/Tour.js";
 import verifyToken from "../middlewear/verifyToken.js";
const router = express.Router();

// 🔹 Submit a tour (protected - provider only)
router.post("/submit", async (req, res) => {
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
    const tours = toursO.filter(tur=>tur.status === "active");
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
router.put("/:tourId", async (req, res) => {
  const { tourId } = req.params;
  const { title, location, date, availability, iataCode,price } = req.body;
console.log("incoming data",req.body );
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
    tour.iataCode= iataCode || tour.iataCode;
    tour.providerId= tour.providerId;
    tour.providerName= tour.providerName;
    tour.price = price || tour.price;
console.log("res",tour);
    const updatedTour = await tour.save();
    res.status(200).json(updatedTour);
  } catch (error) {
    console.error("Error updating tour:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ DELETE a tour
router.delete("/remove/:tourId", async (req, res) => {
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



export default router;
