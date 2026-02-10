import Company from "../model/CompanySchema.js";
import Job from "../model/Jobschema.js";
import User from "../model/User.js";
import UserProfile from "../model/UserProfileSchema.js";

export const dbgetcompaniesbyid = async (companyID) => {
  try {
    if (!companyID) {
      return {
        success: false,
        message: "companyid not found or invalid",
      };
    }
    const company = await Company.findById(companyID);
  
    if (!company) {
      return {
        success: false,
        message: "no company found",
      };
    }
    return {
      success: true,
      message: `company ${company.companyName} details fetched successfully`,
      data: company,
    };
  } catch (error) {
    console.log(error);
  }
};

export const dbupdatecompanystatus = async (companyID, data) => {
  try {
    const { status } = data;

    if (typeof status !== "boolean") {
      return {
        success: false,
        message: "Invalid status value",
      };
    }

    const company = await Company.findByIdAndUpdate(
      companyID,
      { approved: status },
      { new: true },
    );

    if (!company) {
      return {
        success: false,
        message: "Company not found",
      };
    }

    await User.findOneAndUpdate({ companyId: companyID }, { approved: status });

    return {
      success: true,
      message: "Company status updated successfully",
      data: company,
    };
  } catch (error) {
    console.error("Company status update error:", error);

    return {
      success: false,
      message: "Failed to update company status",
    };
  }
};
export const dbgetuser = async () => {
  try {
    const users = await UserProfile.find().sort({createdAt:-1}).populate("userId", "email");

    if (!users) {
      return {
        success: false,
        message: "users not found",
      };
    }
    
    return {
      success: true,
      message: "user fetched successfully",
      data: users,
    };
  } catch (error) {
    return {
      success: false,
      messsage: "sonmething went wrong",
    };
  }
};
export const dbgetjobs = async () => {
  try {
    const jobs = await Job.find();

    if (!jobs) {
      return {
        success: false,
        message: "jobs not found",
      };
    }
    return {
      success: true,
      message: "jobs fetched successfully",
      data: jobs,
    };
  } catch (error) {
    return {
      success: false,
      messsage: "sonmething went wrong",
    };
  }
};
export const dbgetjobsbyid = async (jobID) => {
  try {
    const jobs = await Job.findById(jobID);

    if (!jobs) {
      return {
        success: false,
        message: "job not found",
      };
    }
    return {
      success: true,
      message: "job fetched successfully",
      data: jobs,
    };
  } catch (error) {
    return {
      success: false,
      messsage: "sonmething went wrong",
    };
  }
};

export const dbupdateforced = async (jobID, Data) => {
  try {
 
   
    if (!jobID) {
      return {
        success: false,
        message: "job is invalid",
      };
    }
      const { status } = Data;


    if (typeof status !== "boolean") {
      return {
        success: false,
        message: "Invalid status value",
      };
    }
    const jobs = await Job.findByIdAndUpdate(
      jobID,
      { forcedclose: status, status:status ? "Closed" : "Open" },
      { new: true },
    );
    if (!jobs) {
      return {
        success: false,
        message: "job not found",
      };
    }
    return {
      success: true,
      message: "successfully updated",
    };
  } catch (error) {
    return { success: false, message: "something went wrong" };
  }
};
export const dbgetcompanyadminlist = async () => {
  try {
 const companies = await Company.find({approved:false}).sort({ createdAt: -1 });

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

export const dbupdatecompanypresence=async(companyID,data)=>{
try {
    const { status } = data;

    if (typeof status !== "boolean") {
      return {
        success: false,
        message: "Invalid status value",
      };
    }

  const company = await Company.findById(companyID).select("userId");


    if (!company) {
      return {
        success: false,
        message: "Company not found",
      };
    }

    await User.findByIdAndUpdate(
    company.userId,
    { isblocked:status },
    { new: true }
  );

    return {
      success: true,
      message: "Company status updated successfully",
     
    };
  } catch (error) {
    console.error("Company status update error:", error);

    return {
      success: false,
      message: "Failed to update company status",
    };
  }}