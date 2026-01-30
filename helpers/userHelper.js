
import Application from "../model/ApplicationSchema.js";
import Company from "../model/CompanySchema.js";
import Job from "../model/Jobschema.js";
import User from "../model/User.js";
import UserProfile from "../model/UserProfileSchema.js";

export const dbgetuserjobs = async () => {
  try {
    const companydet = await Job.find({status:"Open"}).sort({ createdAt: -1 });
console.log(companydet);

    
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
     const exist=await UserProfile.findOne({userId})
    console.log(exist);
    
    if(exist){
    return {success:false,message:"already in db"}
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
  console.log(userprofile);
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


export const dbgetjobbyid=async(jobid)=>{
    try {
        const jobData=await Job.findById(jobid)
        console.log(jobData,"-------");
        if(!jobData){
            return{
                success:false,
                message:"not found"
            }
        }
        else{
            return{
                success:true,
                message:"fetched",
                data:jobData
            }
        }
    } catch (error) {
        console.log(error);
        
    }
}


export const dbgetcompanylist=async()=>{
try {
    const companies=await Company.find()
  
    
    if(!companies){
        return{
            success:false,
            message:"companies are empty"
        }

    }
    else{
        return{
            success:true,
            message:"fetched companies",
            data:companies
        }
    }
} catch (error) {
    return {
        success:false,
        message:"something went wrong",
        error:error
    }
}
}

export const dbaddapplication = async (userId, jobId) => {
  try {

    const job = await Job.findById(jobId);


    if (!job) {
      return {
        success: false,
        message: "Job not found",
      };
    }

    const application = await Application.create({
      userId,
      jobId,
      companyId: job.company, 
    });
    await Job.findByIdAndUpdate(jobId, { applied: true }, { new: true });

    return {
      success: true,
      message: "Application submitted successfully",
      data: application,
    };
  } catch (error) {
  
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

