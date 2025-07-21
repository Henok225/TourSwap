import express from "express";
import User from "../models/User.js";

const router = express.Router();

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json({success:true,users});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE a user
router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({success:true, message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({success:false, message: err.message });
  }
});

// ADD a new user (optional, for admin use)
router.post("/", async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const user = new User({ name, email, password, role });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
