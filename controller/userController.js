import {
  dbaddprofile,
  dbgetcompanylist,
  dbgetjobbyid,
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
    console.log(req.body);

   
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
  console.log(userID);

  const result = await dbgetuserprofile(userID);
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(404).json(result);
  }
};
export const getjobbyid=async(req,res)=>{
    const jobid=req.params.id
    const result=await dbgetjobbyid(jobid)

    
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