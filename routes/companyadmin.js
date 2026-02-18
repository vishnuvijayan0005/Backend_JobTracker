import express from 'express';
import { protect } from '../middleware/protect.js';
import { addinterviewschedule, getapplicants, getcompanydashboard, getCompanyDashboardsearch, getcompanyprofile, getinterviewapplicants, getjobbyidbycompany, getshortlisted, myjobs, postnewjob, updateApplicationStatus, updatecompanyprofile, updateinterview, updatejobdetails, updatestatus } from '../controller/campanyadminController.js';
const router = express.Router();

router.get('/', (req, res) => {
  res.send('respond with a resource');
});

router.post('/postnewjob',protect,postnewjob)
router.get("/myjobs",protect,myjobs)
router.get("/profile",protect,getcompanyprofile)
router.patch("/job/:id/status",protect,updatestatus)
router.get("/getapplicants",protect,getapplicants)
router.patch("/updateApplicationStatus",protect,updateApplicationStatus)
router.get("/getshortlisted",protect,getshortlisted)
router.post("/schedule-interview",protect,addinterviewschedule)
router.get("/getinterviewapplicants",protect,getinterviewapplicants)
router.patch("/update-interview-result",protect,updateinterview)
router.get("/getcompanydashboard",protect,getcompanydashboard)
router.get("/fetchdashboardsearch",protect,getCompanyDashboardsearch)
 router.get("/jobsdetails/:id",protect,getjobbyidbycompany)
 router.put("/editjob/:id",protect,updatejobdetails)
 router.put("/editprofile",protect,updatecompanyprofile)
 
export default router;