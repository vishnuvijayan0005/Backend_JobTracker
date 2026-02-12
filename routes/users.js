import express from "express";

import { protect } from "../middleware/protect.js";
import { addapplication, addprofile, analyzeResume, deletejobapplication, getappliedjobs, getcompanylist, getInterviewData, getjobbyid, getjobs, getnonuserjobbyid, getuserprofile } from "../controller/userController.js";
import upload from "../middleware/upload.js";
import { fetchSearch, getCompanyDashboardsearch } from "../controller/campanyadminController.js";
import atsUpload from "../middleware/atsUpload.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("respond with a resource");
});

router.get("/getjobs",protect,getjobs)
router.post("/addprofile",protect, upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),addprofile)

  router.get("/getuserprofile",protect,getuserprofile)
  router.get("/jobsdetails/:id",protect,getjobbyid)
  router.get("/companieslist",getcompanylist)
  router.post("/addapplication/:id",protect,addapplication)
  router.get("/appliedjobs",protect,getappliedjobs)
  router.delete("/withdrawapplication/:id",protect,deletejobapplication)
  router.get("/fetchsearch",fetchSearch)
  router.get("/getnonuserjobs",getjobs)
    router.get("/jobsdetails/:id/nonuser",getnonuserjobbyid)
    router.get("/interviewData/:id",protect,getInterviewData)
    router.post(
  "/analyze",
  atsUpload.single("resume"),
  analyzeResume
);
export default router;
