import {
  dbgetcompanyprofile,
  dbgetmyobs,
  dbpostnewjob,
  dbupdatestatus,
} from "../helpers/comapanyadminHelper.js";
import Company from "../model/CompanySchema.js";

export const postnewjob = async (req, res) => {
  const company = req.user.id;
  const newjob = { ...req.body, company };

  const result = await dbpostnewjob(newjob);
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(401).json(result);
  }
};

export const myjobs = async (req, res) => {
  const company = req.user.id;

  const result = await dbgetmyobs(company);

  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(401).json(result);
  }
};
export const getcompanyprofile = async (req, res) => {
  const id = req.params.id;

  const result = await dbgetcompanyprofile(id);
  if (result.success) {
    res.json(result);
  } else {
    res.json(result);
  }
};


export const updatestatus=async(req,res)=>{
const id=req.params.id
const {status}=req.body
  try {
    const result = await dbupdatestatus(id, status);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (err) {
    console.error("Update status error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};