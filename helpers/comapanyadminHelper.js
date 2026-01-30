import mongoose from "mongoose";

import Job from "../model/Jobschema.js";
import User from "../model/User.js";
import Company from "../model/CompanySchema.js";

export const dbpostnewjob = async (job) => {
  try {
    const companyUserId = job.company;

    if (!mongoose.Types.ObjectId.isValid(companyUserId)) {
      return {
        success: false,
        message: "Invalid company ID",
      };
    }

    const companyUser = await User.findById(companyUserId).populate("companyid");

    if (!companyUser || !companyUser.companyid) {
      return {
        success: false,
        message: "Company not found",
      };
    }

    const newJob = job.newJob;

    const createdJob = await Job.create({
      title: newJob.title,
      description: newJob.description,
      requirements: newJob.requirements,
      qualifications: newJob.qualifications,
      interviewProcess: newJob.interviewProcess,

      location: newJob.location,
      experience: newJob.experience,
      jobType: newJob.jobType,
      salary: newJob.salary,

      seniorityLevel: newJob.seniorityLevel,

      // convert comma-separated strings → arrays
      skills: newJob.skills
        ?.split(",")
        .map((s) => s.trim())
        .filter(Boolean),

      tags: newJob.tags
        ?.split(",")
        .map((t) => t.trim())
        .filter(Boolean),

      benefits: newJob.benefits
        ?.split(",")
        .map((b) => b.trim())
        .filter(Boolean),

      company: companyUserId,
      companyName: companyUser.companyid.companyName,
    });

    return {
      success: true,
      message: "Job added successfully",
      data: createdJob,
    };
  } catch (error) {
    console.error("Add job error:", error);
    return {
      success: false,
      message: "Job adding failed",
    };
  }
};
export const dbgetmyobs = async (companyid) => {
  try {
    const jobs = await Job.find({ company: companyid }).lean().sort({ createdAt: -1 });

    return {
      success: true,
      message: "fetched jobs",
      data: jobs,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "not fetched jobs",
    };
  }
};
export const dbgetcompanyprofile = async (id) => {
  try {
    const user = await User.findById(id).populate("companyid");
    console.log(user.companyid);

    if (!user.companyid) {
      return {
        success: false,
        message: "Company not found",
      };
    }
    // console.log(user.companyid);

    return {
      success: true,
      message: "Company profile fetched",
      data: user.companyid,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Error fetching company profile",
    };
  }
};


export const dbupdatestatus=async(id,status)=>{
   try {
    const job = await Job.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!job) {
      return { success: false, message: "Job not found" };
    }

    return {
      success: true,
      message: `Job status updated to ${status}`,
      data: job,
    };
  } catch (error) {
    console.error("DB update error:", error);
    return { success: false, message: "Database error" };
  }
};
