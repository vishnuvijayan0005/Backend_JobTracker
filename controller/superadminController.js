import {
  dbgetcompaniesbyid,
  dbgetcompanyadminlist,
  dbgetjobs,
  dbgetjobsbyid,
  dbgetuser,
  dbgetuserbyid,
  dbupdatecompanypresence,
  dbupdatecompanystatus,
  dbupdateforced,
  dbupdateuserstatus,
} from "../helpers/superadminHelper.js";
import Company from "../model/CompanySchema.js";
import Job from "../model/Jobschema.js";
import User from "../model/User.js";
import UserProfile from "../model/UserProfileSchema.js";
import { logout } from "./authcontroller.js";

export const getcompaniesbyid = async (req, res) => {
  const result = await dbgetcompaniesbyid(req.params.id);
  if (result.success) {
    return res.status(200).json(result);
  } else {
    return res.status(401).json(result);
  }
};

export const updatecompanystatus = async (req, res) => {
  const result = await dbupdatecompanystatus(req.params.id, req.body);

  if (result.success) {
    return res.status(200).json(result);
  } else {
    return res.status(401).json(result);
  }
};
export const getusers = async (req, res) => {
  const result = await dbgetuser();

  if (result.success) {
    return res.status(200).json(result);
  } else {
    return res.status(401).json(result);
  }
};

export const getjobs = async (req, res) => {
  const result = await dbgetjobs();

  if (result.success) {
    return res.status(200).json(result);
  } else {
    return res.status(401).json(result);
  }
};
export const getjobsbyid = async (req, res) => {
  const result = await dbgetjobsbyid(req.params.id);

  if (result.success) {
    return res.status(200).json(result);
  } else {
    return res.status(401).json(result);
  }
};

export const updateforced = async (req, res) => {
  const result = await dbupdateforced(req.params.id,req.body);

  if (result.success) {
    return res.status(200).json(result);
  } else {
    return res.status(401).json(result);
  }
};

export const getcompanyadminlist=async(req,res)=>{
try {
    const result=await dbgetcompanyadminlist()
    if(!result.success){
        return res.status(404).json(result)
    }
    else{
        return res.status(200).json(result)
    }
} catch (error) {
    console.log(error);
    return res.status(500).json({error:error})
}
}

export const updatecompanypresence=async(req,res)=>{
   const result = await dbupdatecompanypresence(req.params.id, req.body);

  if (result.success) {
    return res.status(200).json(result);
  } else {
    return res.status(401).json(result);
  }  
}

export const updateuserstatus=async(req,res)=>{
 
 
 const result = await dbupdateuserstatus(req.params.id, req.body);
  if (result.success) {
    return res.status(200).json(result);
  } else {
    return res.status(401).json(result);
  }  
}


export const getuserbyid=async(req,res)=>{
  const result = await dbgetuserbyid(req.params.id);
  if (result.success) {
    return res.status(200).json(result);
  } else {
    return res.status(401).json(result);
  }     
}



export const getAdminDashboardInfo = async (req, res) => {
  try {
    // 1️⃣ Registered companies
    const totalCompanies = await Company.countDocuments();

    // 2️⃣ Active job posts
    const activeJobs = await Job.countDocuments({ status: "Open" });

    // 3️⃣ Total users
    const totalUsers = await UserProfile.countDocuments();

   
    const pendingApprovals = await Company.countDocuments({ approved: false });

    // 5️⃣ Recent Platform Activity (latest 5 activities)
    const recentCompanies = await Company.find()
      .sort({ createdAt: -1 })
      .limit(2)
      .select("companyName createdAt");
// console.log(recentCompanies);

    const recentJobs = await Job.find()
      .sort({ createdAt: -1 })
      .limit(2)
      .select("title createdAt");


    const recentUsers = await UserProfile.find()
      .sort({ createdAt: -1 })
      .limit(1)
      .select("firstName middleName lastName createdAt");
// console.log(recentUsers);

    // Format activity messages
    const activity = [
      ...recentCompanies.map(
        (c) =>
          `${c.status === "pending" ? "⚠ Company pending approval" : "✔ New company registered"}: ${c.companyName}`
      ),
      ...recentJobs.map((j) => `📄 New job posted: ${j.title}`),
...recentUsers.map(
  (u) => `👤 New user joined: ${u.firstName} ${u.middleName || ""} ${u.lastName}`
),
    ];

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalCompanies,
          activeJobs,
          totalUsers,
          pendingApprovals,
        },
        activity,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard info",
    });
  }
};
