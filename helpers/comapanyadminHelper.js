import mongoose from "mongoose";

import Job from "../model/Jobschema.js";
import User from "../model/User.js";
import Company from "../model/CompanySchema.js";
import Application from "../model/ApplicationSchema.js";
import Interview from "../model/InterviewSchema.js";
import { notifyUsersAboutJob } from "../controller/userController.js";
import { logAudit } from "../utils/auditLogger.js";

export const dbpostnewjob = async (job) => {
  try {
    // console.log("JOB DATA:", job);

    const companyUserId = job.company;

    if (!mongoose.Types.ObjectId.isValid(companyUserId)) {
      return {
        success: false,
        message: "Invalid company ID",
      };
    }

    const companyUser = await User
      .findById(companyUserId)
      .populate("companyid");

    if (!companyUser || !companyUser.companyid) {
      return {
        success: false,
        message: "Company not found",
      };
    }

    const createdJob = await Job.create({
      title: job.title,
      description: job.description,
      requirements: job.requirements,
      qualifications: job.qualifications,
      interviewProcess: job.interviewProcess,

      location: job.location,
      experience: job.experience,
      jobMode: job.jobMode,
      jobType: job.jobType,
      salary: job.salary,

      seniorityLevel: job.seniorityLevel,

      // already arrays → keep as-is
      skills: Array.isArray(job.skills)
        ? job.skills
        : job.skills?.split(",").map(s => s.trim()),

      tags: Array.isArray(job.tags)
        ? job.tags
        : job.tags?.split(",").map(t => t.trim()),

      benefits: Array.isArray(job.benefits)
        ? job.benefits
        : job.benefits?.split(",").map(b => b.trim()),

      company: companyUser.companyid,
      companyName: companyUser.companyid.companyName,
    });

    // await logAudit({
    //   user: companyUserId, 
    //   action: "CREATE_JOB",
    //   targetType: "Job",
    //   userName:createdJob.companyName,
    //   targetId: createdJob._id,
    //   details: `Job title: ${createdJob.title}`,
     
    // });
 await notifyUsersAboutJob(createdJob)
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
    // console.log(companyid);
    const companyData= await Company.findOne({userId:companyid})
    // console.log(companyData._id);
    
    const jobs = await Job.find({ company: companyData._id })
      .lean()
      .sort({ createdAt: -1 });


    return {
      success: true,
      message: "fetched jobs",
      data: jobs,
    };
  } catch (error) {
    // console.log(error);
    return {
      success: false,
      message: "not fetched jobs",
    };
  }
};
export const dbgetcompanyprofile = async (id) => {
  try {
    const user = await User.findById(id).populate("companyid");
    // console.log(user.companyid);

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

export const dbupdatestatus = async (id, status) => {
  try {
    // 1️⃣ Fetch job first
    const job = await Job.findById(id);

    if (!job) {
      return { success: false, message: "Job not found" };
    }

    // 2️⃣ Block if admin force-closed
    if (job.forcedclose === true) {
      return {
        success: false,
        message: "Admin has closed this job. Please contact admin.",
      };
    }

    // 3️⃣ Update status
    job.status = status;
    await job.save();

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


export const dbgetapplicants = async (companyId) => {
  try {
    // console.log(companyId, "------");

    const applications = await Application.find({ companyId })
      .populate("jobId", "_id title")
      .populate("userId", "_id name email phone")
      .sort({ createdAt: -1 });

    const formattedJobs = applications.map((app) => ({
      applicationId: app._id,
      jobId: app.jobId?._id?.toString() || null,
      jobTitle: app.jobId?.title || "",
      applicant: {
        id: app.userId?._id,
        name: app.userId?.name,
        email: app.userId?.email,
        phone: app.userId?.phone,
      },
      appliedAt: app.appliedAt,
      status: app.Applicationstatus,
      resumeUrl: app.resumeUrl,
    }));

    return {
      success: true,
      message: "Applicants fetched successfully",
      data: formattedJobs,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to fetch applicants",
    };
  }
};
export const dbupdateApplicationStatus = async (id, status) => {
  try {
    const job = await Application.findByIdAndUpdate(
      id,
      { Applicationstatus: status },
      { new: true },
    );
    // console.log(job);

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

export const dbgetshortlisted = async (companyId) => {
  try {
    // console.log(companyId, "------");

    const applications = await Application.find({
      companyId,
      Applicationstatus: "shortlisted",
    })
      .populate("jobId", "_id title")
      .populate("userId", "_id name email phone")
      .sort({ createdAt: -1 });
    // console.log(applications);

    const formattedJobs = applications.map((app) => ({
      applicationId: app._id,
      jobId: app.jobId?._id?.toString() || null,
      jobTitle: app.jobId?.title || "",
      applicant: {
        id: app.userId?._id,
        name: app.userId?.name,
        email: app.userId?.email,
        phone: app.userId?.phone,
      },
      appliedAt: app.appliedAt,
      status: app.Applicationstatus,
      resumeUrl: app.resumeUrl,
    }));

    return {
      success: true,
      message: "Applicants fetched successfully",
      data: formattedJobs,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to fetch applicants",
    };
  }
};

export const dbaddinterview = async (companyId, interviewData) => {
  try {
    const { applicationId, date, time, mode, location, meetingLink, notes } =
      interviewData;

    if (!applicationId || !date || !time || !mode) {
      return {
        success: false,
        message: "Missing required interview fields",
      };
    }

    const interview = await Interview.create({
      companyId,
      applicationId,
      date,
      time,
      mode,
      location: mode === "offline" ? location : undefined,
      meetingLink: mode === "online" ? meetingLink : undefined,
      notes,
      status: "scheduled",
    });

    return {
      success: true,
      message: "Interview scheduled successfully",
      data: interview,
    };
  } catch (error) {
    console.error("Add interview error:", error);
    return {
      success: false,
      message: "Failed to schedule interview",
    };
  }
};

export const dbgetinterviewapplicants = async (companyId) => {
  try {
    // console.log(companyId, "------");

    const applications = await Application.find({
      companyId,
      Applicationstatus: "interview",
    })
      .populate("jobId", "_id title")
      .populate("userId", "_id name email phone")
      .sort({ createdAt: -1 });
    // console.log(applications);

    const formattedJobs = applications.map((app) => ({
      applicationId: app._id,
      jobId: app.jobId?._id?.toString() || null,
      jobTitle: app.jobId?.title || "",
      applicant: {
        id: app.userId?._id,
        name: app.userId?.name,
        email: app.userId?.email,
        phone: app.userId?.phone,
      },
      appliedAt: app.appliedAt,
      status: app.Applicationstatus,
      resumeUrl: app.resumeUrl,
    }));

    return {
      success: true,
      message: "Applicants fetched successfully",
      data: formattedJobs,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to fetch applicants",
    };
  }
};

export const dbupdateinterview = async (data) => {
  const { applicationId, result, resultNote } = data;
  // console.log(data);
  
  try {
    const job = await Interview.findOneAndUpdate(
      {applicationId},
      { interviewResult: result, interviewResultNote: resultNote || " " ,status:"completed"},
      { new: true },
    );
    // console.log(job);

    const update = await Application.findByIdAndUpdate(applicationId, {
      Applicationstatus: result,
    });

    // console.log(update);

    if (!job) {
      return { success: false, message: "Job not found" };
    }

    return {
      success: true,
      message: `Job status updated to ${result}`,
      // data: job,
    };
  } catch (error) {
    console.error("DB update error:", error);
    return { success: false, message: "Database error" };
  }
};
export const dbgetcompanydashboard = async (userID) => {
  try {
    /* ================= JOBS ================= */
    const jobs = await Job.find(
      { company: userID },
      {
        _id: 1,
        title: 1,
        jobType: 1,
        status: 1,
        createdAt: 1,
      }
    ).sort({ createdAt: -1 });

    const jobIds = jobs.map(job => job._id);

    const totalActiveJobs = jobs.filter(
      job => job.status === "Open"
    ).length;

   
    const applicationStats = await Application.aggregate([
      { $match: { jobId: { $in: jobIds } } },
      {
        $group: {
          _id: null,
          totalApplicants: { $sum: 1 },
          shortlisted: {
            $sum: {
              $cond: [{ $eq: ["$Applicationstatus", "shortlisted"] }, 1, 0],
            },
          },
          rejected: {
            $sum: {
              $cond: [{ $eq: ["$Applicationstatus", "rejected"] }, 1, 0],
            },
          },
          hired: {
            $sum: {
              $cond: [{ $eq: ["$Applicationstatus", "hired"] }, 1, 0],
            },
          },
        },
      },
    ]);

    const stats = applicationStats[0] || {
      totalApplicants: 0,
      shortlisted: 0,
      rejected: 0,
      hired: 0,
    };


    return {
      success: true,
      message: "Company dashboard data fetched",
      data: {
        totalJobs: jobs.length,
        totalActiveJobs,
        totalApplicants: stats.totalApplicants,
        shortlistedCandidates: stats.shortlisted,
        rejectedCandidates: stats.rejected,
        hiredCandidates: stats.hired,
        jobs,
      },
    };

  } catch (error) {
    return {
      success: false,
      message: "Error fetching dashboard data",
      error,
    };
  }
};

export const dbgetjobbyidbycompany = async (jobid, userId) => {
  try {
    /* ================= JOB ================= */
    const jobData = await Job.findById(jobid);

    if (!jobData) {
      return {
        success: false,
        message: "Job not found",
      };
    }

    /* ================= APPLICATIONS ================= */
    const applications = await Application.find({
      jobId: jobid,
      companyId: userId,
    });


 
    const totalApplicants = applications.length;

    const statusCounts = {
      applied: 0,
      shortlisted: 0,
      hired: 0,
      rejected: 0,
    };

    applications.forEach((app) => {
      if (statusCounts[app.Applicationstatus] !== undefined) {
        statusCounts[app.Applicationstatus]++;
      }
    });

    /* ================= RESPONSE ================= */
    return {
      success: true,
      message: "Fetched job details",
      data: {
        ...jobData.toObject(),
        totalApplicants,
        applicantsBreakdown: statusCounts,
      },
    };
  } catch (error) {
    console.error("dbgetjobbyidbycompany error:", error);
    return {
      success: false,
      message: "Something went wrong",
    };
  }
};


export const dbupdatejobdetails = async (jobid, userid, jobData) => {
  try {
    const job = await Job.findOne({
      _id: jobid,
     
    });

    if (!job) {
      return {
        success: false,
        message: "Job not found or unauthorized",
      };
    }

    // Fields allowed to update (matches frontend)
    const allowedFields = [
      "title",
      "location",
      "jobType",
      "jobMode",
      "salary",
      "description",
      "requirements",
      "qualifications",
      "benefits",
      "seniorityLevel",
      "interviewProcess",
      "experience",
      "skills",
      "tags",
      "status",
    ];

    // Update only allowed fields
    allowedFields.forEach((field) => {
      if (jobData[field] !== undefined) {
        job[field] = jobData[field];
      }
    });

    await job.save();

    return {
      success: true,
      message: "Job details updated successfully",
      data: job.toObject(),
    };
  } catch (error) {
    console.error("dbupdatejobdetails error:", error);
    return {
      success: false,
      message: "Failed to update job details",
    };
  }
};
export const dbupdatecompanyprofile = async (userId, profileData) => {
  try {
 

    const companyData = profileData.company;

    if (!companyData) {
      return {
        success: false,
        message: "No company data provided",
      };
    }

    const company = await Company.findOne({
      _id: companyData._id,
    });

    if (!company) {
      return {
        success: false,
        message: "Company not found or unauthorized",
      };
    }

    
    const allowedFields = [
      "companyName",
      "Companylocation",
      "phone",
      "email",
      "siteId",
      "Companytype",
      "description",
      "logo",
    ];

    allowedFields.forEach((field) => {
      if (companyData[field] !== undefined) {
        company[field] = companyData[field];
      }
    });

    await company.save();

    return {
      success: true,
      message: "Company profile updated successfully",
      data: company.toObject(),
    };
  } catch (error) {
    console.error("dbupdatecompanyprofile error:", error);
    return {
      success: false,
      message: "Failed to update company profile",
    };
  }
};
