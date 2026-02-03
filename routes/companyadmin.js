import express from 'express';
import { protect } from '../middleware/protect.js';
import { addinterviewschedule, getapplicants, getcompanyprofile, getinterviewapplicants, getshortlisted, myjobs, postnewjob, updateApplicationStatus, updateinterview, updatestatus } from '../controller/campanyadminController.js';
const router = express.Router();

router.get('/', (req, res) => {
  res.send('respond with a resource');
});

router.post('/postnewjob',protect,postnewjob)
router.get("/myjobs",protect,myjobs)
router.get("/profile/:id",protect,getcompanyprofile)
router.patch("/job/:id/status",protect,updatestatus)
router.get("/getapplicants",protect,getapplicants)
router.patch("/updateApplicationStatus",protect,updateApplicationStatus)
router.get("/getshortlisted",protect,getshortlisted)
router.post("/schedule-interview",protect,addinterviewschedule)
router.get("/getinterviewapplicants",protect,getinterviewapplicants)
router.patch("/update-interview-result",protect,updateinterview)
export default router;