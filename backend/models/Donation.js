import mongoose from "mongoose";

const DonationSchema = new mongoose.Schema({
  title: { type: String, required: true },          // Mr / Ms
  donorName: { type: String, required: true },      
  email: { type: String, required: true },
  phone: { type: String, required: true },

  centreId: { type: String, required: true },

  amount: { type: Number, required: true },
  cause: { type: String, required: true },
  paymentMethod: { type: String, required: true },

  recurring: { type: Boolean, default: false },

  // NEW FIELD FOR IMAGE UPLOAD
  photoUrl: {
    type: String,
    default: "",
  },

  // OPTIONAL: if later you use Cloudinary/S3 + deletion
  photoPublicId: {
    type: String,
    default: "",
  },

  date: { type: Date, default: Date.now }
});

export default mongoose.model("Donation", DonationSchema);
