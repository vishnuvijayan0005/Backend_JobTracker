import Application from "../model/ApplicationSchema.js";
import Company from "../model/CompanySchema.js";
import Job from "../model/Jobschema.js";
import User from "../model/User.js";
import UserProfile from "../model/UserProfileSchema.js";

export const dbgetuserjobs = async () => {
  try {
    const companydet = await Job.find({ status: "Open" ,forcedclose:"false"}).sort({
      createdAt: -1,
    });
    // console.log(companydet);

    if (!companydet) {
      return {
        success: false,
        message: "job details not found",
      };
    }
    return {
      success: true,
      message: "successfully fecthed",
      data: companydet,
    };
  } catch (error) {
    console.log(error);
  }
};

export const dbaddprofile = async (profileData, userId) => {
  const {
    firstName,
    middleName,
    lastName,
    phone,
    location,
    headline,
    bio,
    skills,
    experience,
    resumeUrl,
    gender,
    education,
    socials,
    photoUrl,
  } = profileData;

  try {
    const exist = await UserProfile.findOne({ userId });
    // console.log(exist);

    if (exist) {
      return { success: false, message: "already in db" };
    }
    await UserProfile.create({
      userId,

      firstName,
      middleName,
      lastName,
      phone,
      location,
      headline,
      bio,

      skills: skills ? skills.split(",").map((s) => s.trim()) : [],

      experience: Number(experience),

      resumeUrl,
      gender,
      education,
      socials,

      photoUrl,

      isProfileComplete: true,
    });

    await User.findByIdAndUpdate(
      userId,
      { isprofilefinished: true },
      { new: true },
    );

    return { success: true, message: "Profile completed" };
  } catch (error) {
    console.error("Add profile error:", error.message);
    return { success: false, message: "Some issues are there" };
  }
};

export const dbgetuserprofile = async (id) => {
  const userprofile = await UserProfile.find({ userId: id });
  // console.log(userprofile);
  try {
    if (!userprofile) {
      return {
        success: false,
        message: "userprofile not exist,have to complete user profile",
      };
    } else {
      return {
        success: true,
        data: userprofile,
        message: "fetched successfully",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "something went wrong",
    };
  }
};

export const dbgetjobbyid = async (jobid,userId) => {
  try {
    const jobData = await Job.findById(jobid);
    // console.log(jobData, "-------");
    
    if (!jobData) {
      return {
        success: false,
        message: "not found",
      };

    } 

    const application = await Application.findOne({
      userId,
      jobId:jobid,
    });


    const jobStatus = application ? application.status : "open";
      return {
        success: true,
        message: "fetched",
        data: jobData.toObject(),
        jobStatus
      };
    
  } catch (error) {
    console.log(error);
  }
};

export const dbgetcompanylist = async () => {
  try {
    const companies = await Company.find({approved:true}).sort({createdAt:-1}).populate("userId", "isblocked");

console.log(companies);


    if (!companies) {
      return {
        success: false,
        message: "companies are empty",
      };
    } else {
      return {
        success: true,
        message: "fetched companies",
        data: companies,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "something went wrong",
      error: error,
    };
  }
};

export const dbaddapplication = async (userId, jobId) => {
  try {
    if (!userId || !jobId) {
      return { success: false, message: "Invalid user or job ID" };
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return { success: false, message: "Job not found" };
    }

    const resume = await UserProfile.findOne({ userId });
    const applicationData = {
      userId,
      jobId,
      companyId: job.company,
    };
    if (resume?.resumeUrl) applicationData.resumeUrl = resume.resumeUrl;

    const application = await Application.create(applicationData);

    return {
      success: true,
      message: "Application submitted successfully",
      data: application,
    };
  } catch (error) {
    console.error("Error creating application:", error);
    if (error.code === 11000) {
      return {
        success: false,
        message: "You have already applied for this job",
      };
    }

    return {
      success: false,
      message: "Something went wrong",
      error,
    };
  }
};


export const dbgetappliedjobs = async (userId) => {
  try {
    const applications = await Application.find({ userId })
      .populate("jobId")
      .sort({ createdAt: -1 });

    const formattedJobs = applications.map((app) => ({
      id: app.jobId?._id?.toString() || null,
      title: app.jobId?.title || "",
      companyName: app.jobId?.companyName || "",
      location: app.jobId?.location || "",
      appliedAt: app.appliedAt,
      status: app.Applicationstatus || "applied",
    }));

    return {
      success: true,
      message: "Applied jobs fetched successfully",
      data: formattedJobs,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to fetch applied jobs",
    };
  }
};

export const dbdeletejobapplication = async (userId, jobId) => {
  try {
    const deletedApplication = await Application.findOneAndDelete({
      userId,
      jobId,
    });
    // await Job.findByIdAndUpdate(jobId, { applied: false }, { new: true });
    if (!deletedApplication) {
      return {
        success: false,
        message: "Application not found or already withdrawn",
      };
    }

    return {
      success: true,
      message: "Application withdrawn successfully",
      data: deletedApplication,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to withdraw application",
    };
  }
};

export const dbgetnonuserjobbyid=async(jobId)=>{
    try {
    const jobData = await Job.findById(jobId);
    // console.log(jobData, "-------");
    
    if (!jobData) {
      return {
        success: false,
        message: "not found",
      };

    } 
      return {
        success: true,
        message: "fetched",
        data: jobData.toObject(),
    
      };
    
  } catch (error) {
    console.log(error);
  }
}