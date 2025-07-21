import mongoose from "mongoose";
import { type } from "os";

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
  description: { type: String, required: true },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  status: {
    type: String,
    enum: ["active", "Suspended","Draft", "Pending Review"],
    default: "active",
  },
  bookings: {type: Number, default: 0},
});

export default mongoose.model("Tour", tourSchema);
