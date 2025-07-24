import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// **User Registration**
router.post("/signup", async (req, res) => {
  
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ success:false, message: "Email already in use" });
}
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new User({ name, email, password: hashedPassword , role});
    await newUser.save();

    res.status(201).json({success:true,  message: "User registered successfully!" });
  } catch (error) {
    console.error("signup Error:", error);
    res.status(500).json({ error: "Error registering user" });
  }
});

// **User Login**
router.post("/login", async (req, res) => {
  
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    console.log("User found:", user ? user.name : "No user found with that email");
    if (!user) return res.status(200).json({success:false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
  
    const token = jwt.sign({ userId: user._id, role: user.role, email:user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const data = {
      username: user.name,
       role: user.role, 
       userId: user._id,
       email: user.email
    }
 
    
     res.json({success:true, message: "Login successful", token ,data });
     
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
