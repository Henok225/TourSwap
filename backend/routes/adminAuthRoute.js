import express from "express";
import AdminUser from "../models/AdminUsers.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// **AdminUser Registration**
router.post("/signup", async (req, res) => {
  
  try {
    const { name, email, password } = req.body;
    const existingUser = await AdminUser.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ success:false, message: "Email already in use" });
}
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new AdminUser({ name, email, password: hashedPassword});
    await newUser.save();

    res.status(201).json({success:true,  message: "User registered successfully!" });
  } catch (error) {
    console.error("signup Error:", error);
    res.status(500).json({ error: "Error registering admin" });
  }
});

// **AdminUser Login**
router.post("/login", async (req, res) => {
  
  try {
    const { email, password } = req.body;
    const user = await AdminUser.findOne({ email });

    console.log("User found:", user ? user.name : "No user found with that email");
    if (!user) return res.status(404).json({success:false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
  
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const data = {
      username: user.name,
       userId: user._id
    }
 
    
     res.json({success:true, message: "Login successful", token ,data });
     
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
