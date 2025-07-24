import mongoose from "mongoose";
import { type } from "os";

const ReviewSchema = new mongoose.Schema({
  
  // Reference to the User who wrote the review
  userId: {
    type: String, // Use mongoose.Schema.Types.ObjectId if you have a User model
    required: true,
    trim: true,
    // index: true // Index for efficient lookup of reviews by a specific user
  },
  // The rating given by the user (e.g., 1 to 5 stars)
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    message: 'Rating must be between 1 and 5.'
  },
  comment: {
    type: String,
    trim: true,
    maxlength: 1000, // Optional: Limit review length
    default: ''
  },
 status: {
    type: String,
    enum: ['pending', 'approved', 'flagged'],
    default: 'approved', // Default to approved, or pending if moderation is strict
    trim: true 
  }
});

//  Compound index to ensure a user can only review a specific tour once
ReviewSchema.index({ userId: 1 }, { unique: true });

const tourSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  // iataCode: { type: String, required: true },
  availability: { type: Number, required: true, min: [0, 'Availability cannot be negative'],
  validate: {
    validator: Number.isInteger,
    message: '{VALUE} is not an integer value',
  },},
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  providerName:{type: String, required: true},
  price:{type: Number,required: true},
  imageUrl: { type: String },
  includes: { type: String, required: false },
  excludes: { type: String, required: false },
  description: { type: String, required: true },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  status: {
    type: String,
    enum: ["Active", "Suspended","Draft", "Pending Review"],
    default: "Draft",
  },
  bookings: {type: Number, default: 0},
  review:{type:ReviewSchema, required:false},
  // featured:{type:Boolean,default:false, required:false}

});

export default mongoose.model("Tour", tourSchema);
