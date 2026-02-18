import {
  dbaddapplication,
  dbaddprofile,
  dbdeletejobapplication,
  dbgetappliedjobs,
  dbgetcompanylist,
  dbgetinterviewData,
  dbgetjobbyid,
  dbgetnonuserjobbyid,
  dbgetuserjobs,
  dbgetuserprofile,
} from "../helpers/userHelper.js";
import Company from "../model/CompanySchema.js";
import JobAlert from "../model/JobalertSchema.js";
import Notification from "../model/NotificationSchema.js";
import Subscription from "../model/SubscriptionSchema.js";
import UserProfile from "../model/UserProfileSchema.js";

export const getjobs = async (req, res) => {
  const result = await dbgetuserjobs();
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(401).json(result);
  }
};
export const addprofile = async (req, res) => {
  try {
    const userId = req.user.id;


    const location =
      typeof req.body.location === "string"
        ? JSON.parse(req.body.location)
        : req.body.location;

    const socials =
      typeof req.body.socials === "string"
        ? JSON.parse(req.body.socials)
        : req.body.socials;

    const skills =
      typeof req.body.skills === "string"
        ? JSON.parse(req.body.skills)
        : req.body.skills;

    const photo = req.files?.photo?.[0];
    const resume = req.files?.resume?.[0];

    const result = await dbaddprofile(
      {
        ...req.body,
        location,
        socials,
        skills,
        photoUrl: photo?.path || "",
        resumeUrl: resume?.path || "",
      },
      userId
    );

    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error("Add profile controller error:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


export const getuserprofile = async (req, res) => {
  const userID = req.user.id;
  // console.log(userID);

  const result = await dbgetuserprofile(userID);
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(404).json(result);
  }
};
export const getjobbyid=async(req,res)=>{
    const jobid=req.params.id
    const userid=req.user.id
    const result=await dbgetjobbyid(jobid,userid)

    
    if(result.success){
        res.status(200).json(result)
    }
    else{
         res.status(200).json(result)
    }
}



export const getCompanyList = async (req, res) => {
  try {
    const { search, field } = req.query;

    const result = await dbgetcompanylist({
      search,
      field,
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const addapplication = async (req, res) => {
  try {
    const userID = req.user.id;
    const jobID = req.params.id;

    const result = await dbaddapplication(userID, jobID);

    if (!result.success) {
     
      switch (result.error) {
        case "JOB_NOT_FOUND":
          return res.status(404).json(result);

        case "ALREADY_APPLIED":
          return res.status(409).json(result);

        default:
          return res.status(400).json(result);
      }
    }

    return res.status(201).json(result);

  } catch (error) {
    console.error("Add application error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getappliedjobs = async (req, res) => {
  try {

    
    const userID = req.user.id;

    const result = await dbgetappliedjobs(userID);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch applied jobs",
    });
  }
};

export const deletejobapplication=async(req,res)=>{
  try {

    
    const userID = req.user.id;
    const jobID=req.params.id;
    const result = await dbdeletejobapplication(userID,jobID);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch applied jobs",
    });
  }
}

export const getnonuserjobbyid=async(req,res)=>{
    const jobid=req.params.id
   
    const result=await dbgetnonuserjobbyid(jobid)

    
    if(result.success){
        res.status(200).json(result)
    }
    else{
         res.status(200).json(result)
    }
}

export const getInterviewData=async(req,res)=>{
  const jobid=req.params.id
   const userId=req.user.id
    const result=await dbgetinterviewData(jobid,userId)

    
    if(result.success){
        res.status(200).json(result)
    }
    else{
         res.status(200).json(result)
    }
}

export const getcompanybyid=async(req,res)=>{
  const userId=req.user.id
  const companyId=req.params.id
  try {
  

    if (!companyId) {
      return res.status(400).json({ success: false, message: "Company ID required" });
    }

    const company = await Company.findById( companyId);


    if (!company) {
      return res.status(400).json({ success: false, message: "Company not found" });

    }
const isSubscribed = !!(await Subscription.exists({ userId, companyId }));
  

    res.status(201).json({ success: true, data: {
        company,        
        isSubscribed,   
      },});
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate subscription
      return res.status(400).json({ success: false, message: "Already subscribed" });
    }
    res.status(500).json({ success: false, message: "Server Error" });
  }
}

// --------ats score------


export const analyzeResume = async (req, res) => {
  try {
    const file = req.file;
    const { jobDescription } = req.body;

    if (!file || !jobDescription) {
      return res.status(400).json({
        success: false,
        message: "Resume file and job description required"
      });
    }

    const resumeText = await extractResumeText(file);

    const result = calculateATSScore(
      resumeText,
      jobDescription
    );

    return res.json({
      success: true,
      ...result
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "ATS analysis failed"
    });
  }
};







export const subscribeToCompany = async (req, res) => {
  try {
    const userId = req.user.id; // assuming you have auth middleware
    const companyId  = req.params.id;
 
    


    if (!companyId) {
      return res.status(400).json({ success: false, message: "Company ID required" });
    }

    const subscription = await Subscription.create({ userId, companyId });

    res.status(201).json({ success: true, data: subscription });
  } catch (err) {
    if (err.code === 11000) {
      
      return res.status(400).json({ success: false, message: "Already subscribed" });
    }
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Unsubscribe from a company
export const unsubscribeFromCompany = async (req, res) => {
  try {
    const userId = req.user.id;
    const  companyId  = req.params.id;

    const result = await Subscription.findOneAndDelete({ userId, companyId });

    if (!result) {
      return res.status(404).json({ success: false, message: "Subscription not found" });
    }

    res.status(200).json({ success: true, message: "Unsubscribed successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get all subscriptions of a user
export const getUserSubscriptions = async (req, res) => {
  try {
    const userId = req.user._id;

    const subscriptions = await Subscription.find({ userId }).populate("companyId", "companyName");

    res.status(200).json({ success: true, data: subscriptions });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};






export const createNotification = async ({ userId, type, title, message, link }) => {
  return Notification.create({ userId, type, title, message, link });
};



export const notifyUsersAboutJob = async (job) => {

  const subscribers = await Subscription.find({ companyId: job.company });

  
  for (let sub of subscribers) {
    await Notification.create({
      userId: sub.userId,
      type: "job",
      title: `New job at ${job.companyName}`,
      message: `${job.title} has been posted.`,
      link: `/user/jobsdetails/${job._id}`,
    });
  }

  const alerts = await JobAlert.find({ isActive: true });
  for (let alert of alerts) {
    const matchesKeywords = alert.keywords.some(
      (kw) => job.title.includes(kw) || job.skills.includes(kw)
    );
    const matchesLocation = !alert.location || alert.location === job.location;
    const matchesJobType = !alert.jobType || alert.jobType === job.jobType;

    if (matchesKeywords && matchesLocation && matchesJobType) {
      await Notification.create({
        userId: alert.userId,
        type: "alert",
        title: "Job Alert: Matching your criteria",
        message: `A new job ${job.title} matches your alert.`,
        link: `/user/jobsdetails/${job._id}`,
      });
    }
  }
};
export const createJobAlert = async (req, res) => {
  try {
    const { keywords, location, jobType } = req.body;
    const userId = req.user.id;

    if (!keywords || !keywords.length) {
      return res.status(400).json({ message: "Keywords are required" });
    }

    const newAlert = new JobAlert({
      userId,
      keywords,
      location,
      jobType,
    });

    await newAlert.save();

    res.status(201).json({
      success: true,
      message: "Job alert created successfully",
      alert: newAlert,
    });
  } catch (error) {
    console.error("Error creating job alert:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
export const getUserJobAlerts = async (req, res) => {
  try {
    const userId = req.user._id;

    const alerts = await JobAlert.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, alerts });
  } catch (error) {
    console.error("Error fetching job alerts:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const getCompanyFields = async (req, res) => {
  try {
    const fields = await Company.distinct("companyfield", {
      approved: true,
    });

    res.status(200).json({
      success: true,
      data: fields,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch fields",
    });
  }
};