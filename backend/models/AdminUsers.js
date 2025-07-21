import mongoose from "mongoose";

const AdminUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin"],
    default: "admin"
  },
});



export default mongoose.model("AdminUser", AdminUserSchema);
