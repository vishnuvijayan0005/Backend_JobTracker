import express from 'express';
import { protect } from '../middleware/protect.js';
import { getcompanyprofile, myjobs, postnewjob, updatestatus } from '../controller/campanyadminController.js';
const router = express.Router();

router.get('/', (req, res) => {
  res.send('respond with a resource');
});

router.post('/postnewjob',protect,postnewjob)
router.get("/myjobs",protect,myjobs)
router.get("/profile/:id",protect,getcompanyprofile)
router.patch("/job/:id/status",protect,updatestatus)
export default router;