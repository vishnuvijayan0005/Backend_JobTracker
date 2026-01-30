import mongoose, { Schema } from "mongoose";

const UserProfileSchema = new Schema(
  {
    
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    middleName: {
      type: String,
      trim: true,
      default: "",
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    
    phone: {
      type: String,
      trim: true,
    },

    location: {
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true },
    },


    headline: {
      type: String,
      maxlength: 120,
      trim: true,
    },

    bio: {
      type: String,
      maxlength: 500,
      trim: true,
    },

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    experience: {
      type: Number,
      min: 0,
    },

    resumeUrl: {
      type: String,
      trim: true,
    },


    socials: {
      linkedin: { type: String, trim: true },
      github: { type: String, trim: true },
      portfolio: { type: String, trim: true },
      twitter: { type: String, trim: true },
    },


    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },

    education: {
      type: String,
      trim: true,
    },

    photoUrl: {
      type: String,
    },

    isProfileComplete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const UserProfile = mongoose.model("UserProfile", UserProfileSchema);
export default UserProfile;
