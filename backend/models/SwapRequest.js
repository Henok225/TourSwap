import mongoose from 'mongoose'

const TourInfoSchema = new mongoose.Schema({
    id: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    price: { type: String, required: true, trim: true },
  }, { _id: false });
  
  const UserInfoSchema = new mongoose.Schema({
    userId: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
  }, { _id: false });
  
  const SwapRequestSchema = new mongoose.Schema({
    type: { type: String, enum: ['incoming', 'outgoing'], required: true, trim: true },
    requester: { type: UserInfoSchema, required: true },
    recipient: { type: UserInfoSchema, required: function() { return this.type === 'outgoing'; } },
    offeredTour: { type: TourInfoSchema, required: true },
    requestedTour: { type: TourInfoSchema, required: function() { return this.type === 'outgoing'; } },
    targetedTourBooking: { type: TourInfoSchema, required: true },
    message: { type: String, trim: true, default: '' },
    status: { type: String, enum: ['Pending', 'Accepted', 'Rejected', 'Canceled'], required: true, default: 'Pending' },
  }, { timestamps: true });
  
  SwapRequestSchema.index({ 'requester.userId': 1 });
  SwapRequestSchema.index({ 'recipient.userId': 1 });
  SwapRequestSchema.index({ 'targetedTourBooking.id': 1 });
  
  const Swaprequest = mongoose.model('SwapRequest', SwapRequestSchema);
  
  
  
  export default Swaprequest;
  