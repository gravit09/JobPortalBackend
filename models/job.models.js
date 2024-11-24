import mongoose from "mongoose";
import { Organization } from "./org.models.js";
const jobListingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  organizationName: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
    default: "Remote",
  },
  requirements: {
    experience: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
      required: true,
    },
    qualifications: {
      type: String,
      required: true,
    },
  },
  description: {
    type: String,
    required: true,
  },
  responsibilities: {
    type: [String],
    required: true,
  },
  applyLink: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export const Job = mongoose.model("Job", jobListingSchema);
