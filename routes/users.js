import express from "express";

import { protect } from "../middleware/protect.js";
import {
  addapplication,
  addprofile,
  analyzeResume,
  createJobAlert,
  deletejobapplication,
  getappliedjobs,
  getcompanybyid,
  getCompanyFields,
  getCompanyList,
  getInterviewData,
  getjobbyid,
  getjobs,
  getnonuserjobbyid,
  getUserJobAlerts,
  getuserprofile,
  subscribeToCompany,
  unsubscribeFromCompany,
} from "../controller/userController.js";
import upload from "../middleware/upload.js";
import {
  fetchSearch,
  getCompanyDashboardsearch,
} from "../controller/campanyadminController.js";
import atsUpload from "../middleware/atsUpload.js";
import Subscription from "../model/SubscriptionSchema.js";
import Notification from "../model/NotificationSchema.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("respond with a resource");
});

router.get("/getjobs", protect, getjobs);
router.post(
  "/addprofile",
  protect,
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  addprofile,
);

router.get("/getuserprofile", protect, getuserprofile);
router.get("/jobsdetails/:id", protect, getjobbyid);
router.get("/companieslist", getCompanyList);
router.get("/company/:id",protect,getcompanybyid)
router.post("/addapplication/:id", protect, addapplication);
router.get("/appliedjobs", protect, getappliedjobs);
router.delete("/withdrawapplication/:id", protect, deletejobapplication);
router.get("/fetchsearch", fetchSearch);
router.get("/getnonuserjobs", getjobs);
router.get("/jobsdetails/:id/nonuser", getnonuserjobbyid);
router.get("/interviewData/:id", protect, getInterviewData);
router.post("/analyze", atsUpload.single("resume"), analyzeResume);
router.post("/subscribe/:id",protect,subscribeToCompany)
router.post("/unsubscribe/:id",protect,unsubscribeFromCompany)
router.get("/notifications", protect,async (req, res) => {
  const userId = req.user.id;
  const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
  // console.log(notifications);
  
  res.json({ data: notifications });
});
router.patch("/notifications/:id/read", async (req, res) => {
  const { id } = req.params;
  await Notification.findByIdAndUpdate(id, { isRead: true });
  res.json({ message: "Notification marked as read" });
});
router.post("/jobalert", protect, createJobAlert);

// Get user's alerts
router.get("/jobalerget", protect, getUserJobAlerts);
router.get("/company-fields",getCompanyFields)

export default router;
