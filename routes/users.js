import express from "express";

import { protect } from "../middleware/protect.js";
import { addapplication, addprofile, getcompanylist, getjobbyid, getjobs, getuserprofile } from "../controller/userController.js";
import upload from "../middleware/upload.js";

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
  router.get("/companieslist",protect,getcompanylist)
  router.post("/addapplication/:id",protect,addapplication)
export default router;
