import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema({
  companyName: {
    type: String,
  },

  Companylocation: {
    type: String,
  },
  createdBy: {
    type: String,
  },
  email: {
    type: String,
  },
  description:{
    type:String
  },
  phone:{
    type:Number
  },
  siteid:{
    type:String
  },
  companyfield:{
    type:String
  },
  companylogo:{
    type:String
  },
  approved:{
    type:Boolean
  },
  isDeleted:{
    type:Boolean
  },
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  }
});

const Company = mongoose.model("Company", CompanySchema);
export default Company;
