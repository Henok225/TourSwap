import mongoose from "mongoose";

const bookingschema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  nationality: { type: String, required: true },
  passportNumber: { type: String, required: true },
  paymentReceipt: { type: String, required: true },
  roomType: { type: String, required: true },
  hotelClass: { type: String, required: true },
  additionalRequests: { type: String },
 tourId:{type: mongoose.Schema.Types.ObjectId, ref:"Tour",required: true},
  // hotelName: {type: String},
  // hotelAddress:{type: String},
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userId:{type: mongoose.Schema.Types.ObjectId, ref:"User",required: true},
  status: {
    type: String,
    enum: ["Confirmed", "Denied", "Pending", "Completed"],
    default: "Pending",
  },
}, { timestamps: true });

export default mongoose.model("Booking", bookingschema);
