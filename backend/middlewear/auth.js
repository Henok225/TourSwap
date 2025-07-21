// middleware/auth.js

import jwt from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config();

const authMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    
    const token = req.headers.authorization?.split(" ")[1];
    console.log("Decoded JWT1:", token); 
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded JWT:", decoded); 
      if (!allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }
      req.user = decoded;
      next();
    } catch (err) {
      if(err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Your Session is expired. please login again!" });
      }
      res.status(401).json({ message: "Invalid token" });
      console.log(err);
    }
  };
};

export default authMiddleware;
