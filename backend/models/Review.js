import mongoose from 'mongoose'

const ReviewSchema = new mongoose.Schema({
  tourId: {
    type: String, // ID of the Tour being reviewed
    required: true,
    trim: true,
    index: true
  },
  userId: {
    type: String, // ID of the User who wrote the review
    required: true,
    trim: true,
    index: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    trim: true,
    maxlength: 1000,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'flagged'],
    default: 'approved',
    trim: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Ensures a user can only review a specific tour once
ReviewSchema.index({ tourId: 1, userId: 1 }, { unique: true });

const Review = mongoose.model('Review', ReviewSchema);

export default Review;
