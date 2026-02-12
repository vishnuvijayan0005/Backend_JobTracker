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
    // console.log(req.body);

   
    const location =
      typeof req.body.location === "string"
        ? JSON.parse(req.body.location)
        : req.body.location;

    const socials =
      typeof req.body.socials === "string"
        ? JSON.parse(req.body.socials)
        : req.body.socials;
    const photo = req.files?.photo?.[0];
    const resume = req.files?.resume?.[0];

    const result = await dbaddprofile(
      {
        ...req.body,
        location,
        socials,
        photoUrl: photo?.path || "",
        resumeUrl: resume?.path || "",
      },
      userId,
    );

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
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



export const getcompanylist=async(req,res)=>{
try {
    const result=await dbgetcompanylist()

    
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



// --------ats score------
import { extractResumeText } from "../services/resumeParser.js";
import { calculateATSScore } from "../services/atsEngine.js";

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
