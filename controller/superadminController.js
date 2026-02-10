import {
  dbgetcompaniesbyid,
  dbgetcompanyadminlist,
  dbgetjobs,
  dbgetjobsbyid,
  dbgetuser,
  dbupdatecompanypresence,
  dbupdatecompanystatus,
  dbupdateforced,
} from "../helpers/superadminHelper.js";

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