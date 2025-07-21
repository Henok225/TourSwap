import express from "express";
import User from "../models/User.js";
import Tour from "../models/Tour.js";
import verifyToken from "../middlewear/verifyToken.js"; // Adjust path if needed


const router = express.Router();

 
router.get("/", async (req, res) => {
    try {
        // 🔹 Get all tours #
      const tours = await Tour.find().populate("providerId", "name email");

      //   get all users #
      const users = await User.find();

      res.status(200).json({success:true,tours, users });
    } catch (error) {
      console.error("Error getting tours:", error.message);
      res.status(500).json({success:false, message: "Error retrieving tours" });
    }
  });




  export default router;