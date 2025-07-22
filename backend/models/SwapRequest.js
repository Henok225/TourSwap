import mongoose from 'mongoose'

// Schema for basic user information (requester, recipient)
const UserInfoSchema = new mongoose.Schema({
  userId: {
    type: String, // Or mongoose.Schema.Types.ObjectId if referencing a User model
    required: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type:String,
    required:false,
    trim:true
  },
}, { _id: false }); // No _id for embedded sub-documents

// Schema for tour information (flexible for offeredTour, requestedTour, targetedTourBooking)
const TourInfoSchema = new mongoose.Schema({
  id: {
    type: String, // This is the original Tour._id or TourListing._id
    required: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  // Specific to offeredTour (e.g., booking's updatedAt)
  date: {
    type: Date, // Using Date type for dates
    required: false, // Optional, as requestedTour might not have a specific date
  },
  price: {
    type: String, // Or Number if you want to store as numerical value
    required: false, // Optional, as requestedTour might not have a specific price
    trim: true,
  },
  // Specific to requestedTour (location from listing)
  location: {
    type: String,
    required: false, // Optional, as offeredTour might not explicitly pass location
    trim: true,
  },
  // Specific to offeredTour (the actual booking ID from the requester's side)
  bookingId: {
    type: String, // This is the specific Booking._id that the requester is offering
    required: false, // Only present for offeredTour
    trim: true,
  },
}, { _id: false }); // No _id for embedded sub-documents

// Main TourSwap Schema
const TourSwapSchema = new mongoose.Schema({
  requester: { // The user who initiated the swap request
    type: UserInfoSchema,
    required: true,
  },
  recipient: { // The user who owns the targeted tour (populated by backend for open swaps)
    type: UserInfoSchema,
    required: false, // This field is optional and filled by the backend if a recipient is found
  },
  offeredTour: { // The specific tour booking that the requester is offering
    type: TourInfoSchema,
    required: true,
  },
  requestedTour: { // The general tour listing that the requester wants
    type: TourInfoSchema,
    required: true,
  },
  targetedTourBooking: { // The specific booking on the recipient's side that matches the requestedTour
    type: TourInfoSchema,
    required: false, // This field is optional and filled by the backend after discovery
  },
  message: {
    type: String,
    trim: true,
    default: '',
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected', 'Canceled'],
    required: true,
    default: 'Pending',
  },
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Indexes for efficient querying
TourSwapSchema.index({ 'requester.userId': 1 });
TourSwapSchema.index({ 'recipient.userId': 1 }, { sparse: true }); // Sparse index for optional recipient
TourSwapSchema.index({ 'offeredTour.bookingId': 1 }); // To quickly find swaps by the specific booking being offered
TourSwapSchema.index({ 'requestedTour.id': 1 }); // To quickly find swaps by the general tour ID requested
TourSwapSchema.index({ 'targetedTourBooking.id': 1 }, { sparse: true }); // Sparse index for optional targeted booking
TourSwapSchema.index({ 'status': 1 }); // For filtering by swap status

// Create the Mongoose model
const TourSwap = mongoose.model('TourSwap', TourSwapSchema);
  
  
  export default TourSwap;
  