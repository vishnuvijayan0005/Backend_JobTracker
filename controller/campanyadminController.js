import {
  dbaddinterview,

  dbgetapplicants,
  dbgetcompanyprofile,
  dbgetinterviewapplicants,
  dbgetmyobs,
  dbgetshortlisted,
  dbpostnewjob,
  dbupdateApplicationStatus,
  dbupdateinterview,
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

export const getapplicants=async(req,res)=>{
  const userID=req.user.id
  try {
    const result = await dbgetapplicants(userID);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (err) {
    console.error("Update status error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export const updateApplicationStatus=async(req,res)=>{
 
const {applicationId,status}=req.body
  try {
    const result = await dbupdateApplicationStatus(applicationId, status);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (err) {
    console.error("Update status error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export const getshortlisted=async(req,res)=>{
  const userID=req.user.id
  try {
    const result = await dbgetshortlisted(userID);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (err) {
    console.error("Update status error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
export const addinterviewschedule=async(req,res)=>{
  const userID=req.user.id

  try {
    const result = await dbaddinterview(userID,req.body);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (err) {
    console.error("Update status error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export const getinterviewapplicants=async(req,res)=>{
  const userID=req.user.id
  try {
    const result = await dbgetinterviewapplicants(userID);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (err) {
    console.error("Update status error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

export const updateinterview=async(req,res)=>{
 

  try {
    const result = await dbupdateinterview(req.body);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (err) {
    console.error("Update status error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}