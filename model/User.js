import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
  },
  approved: {
    type: Boolean,
    default: false,
  },
  companyid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  isprofilefinished: {
    type: Boolean,
    default: true,
  },
  isdeleted: {
    type: Boolean,
    default: false,
  },
  isblocked: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken: {
    type: String,
  },

  resetPasswordExpire: {
    type: Date,
  },
  emailVerifyToken: { 
    type: String
   },
  emailVerifyExpires: { 
    type: Date 
  },
  isEmailVerified:{
    type:String,
    default:false
  },
});
const User = mongoose.model("User", UserSchema);
export default User;
