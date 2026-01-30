import {
  dbgetcompanyprofile,
  dbgetmyobs,
  dbpostnewjob,
} from "../helpers/comapanyadminHelper.js";
import Company from "../model/CompanySchema.js";

export const postnewjob = async (req, res) => {
  const company = req.user.id;
  const newjob = { ...req.body, company };

  const result = await dbpostnewjob(newjob);
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(401).json(result);
  }
};

export const myjobs = async (req, res) => {
  const company = req.user.id;

  const result = await dbgetmyobs(company);

  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(401).json(result);
  }
};
export const getcompanyprofile = async (req, res) => {
  const id = req.params.id;

  const result = await dbgetcompanyprofile(id);
  if (result.success) {
    res.json(result);
  } else {
    res.json(result);
  }
};
