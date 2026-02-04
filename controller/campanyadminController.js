import {
  dbaddinterview,

  dbgetapplicants,
  dbgetcompanydashboard,
  dbgetcompanyprofile,
  dbgetinterviewapplicants,
  dbgetjobbyidbycompany,
  dbgetmyobs,
  dbgetshortlisted,
  dbpostnewjob,
  dbupdateApplicationStatus,
  dbupdatecompanyprofile,
  dbupdateinterview,
  dbupdatejobdetails,
  dbupdatestatus,
} from "../helpers/comapanyadminHelper.js";
import Company from "../model/CompanySchema.js";
import Job from "../model/Jobschema.js";

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

export const getcompanydashboard=async(req,res)=>{
  try {
    const userID=req.user.id;
    const result=await dbgetcompanydashboard(userID)
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
export const getCompanyDashboardsearch = async (req, res) => {
  try {
    const userId = req.user.id;
    const search = (req.query.search || "").trim();


    const query = {
      company: userId,
    };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { jobType: { $regex: search, $options: "i" } },
      ];
    }

    const jobs = await Job.find(query)
      .select("title jobType status createdAt")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: {
        jobs,
      },
    });
  } catch (error) {
    console.error("Dashboard search error:", error);
    return res.status(500).json({
      success: false,
      message: "Search failed",
    });
  }
};

export const getjobbyidbycompany=async(req,res)=>{
    const jobid=req.params.id
    const userid=req.user.id
    const result=await dbgetjobbyidbycompany(jobid,userid)

    
    if(result.success){
        res.status(200).json(result)
    }
    else{
         res.status(200).json(result)
    }
}

export const updatejobdetails=async(req,res)=>{
  const jobid=req.params.id
    const userid=req.user.id
    
    const result=await dbupdatejobdetails(jobid,userid,req.body)

    
    if(result.success){
        res.status(200).json(result)
    }
    else{
         res.status(200).json(result)
    }
}

export const updatecompanyprofile=async(req,res)=>{
  const userID=req.user.id
   const result=await dbupdatecompanyprofile(userID,req.body)

    
    if(result.success){
        res.status(200).json(result)
    }
    else{
         res.status(200).json(result)
    }
  
}