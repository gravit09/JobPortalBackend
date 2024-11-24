import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  founded: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

export const Organization = mongoose.model("Organization", organizationSchema);
