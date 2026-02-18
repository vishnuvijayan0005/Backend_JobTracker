import express from 'express';
import {  getAdminDashboardInfo, getcompaniesbyid, getcompanyadminlist, getjobs, getjobsbyid, getuserbyid, getusers, updatecompanypresence, updatecompanystatus, updateforced, updateuserstatus } from '../controller/superadminController.js';

import { protect } from '../middleware/protect.js';
import { adminprotect } from '../middleware/adminprotect.js';
const router = express.Router();



router.get("/companies", protect,adminprotect,getcompanyadminlist) //companies
router.get("/companies/:id", protect,adminprotect,getcompaniesbyid) //company by id
router.patch("/companyupdate/:id/status", protect,adminprotect,updatecompanystatus) //approve or disable
router.patch("/company/:id/status", protect,adminprotect,updatecompanypresence) 
router.patch("/user/:id/status", protect,adminprotect,updateuserstatus) 
router.get("/users", protect,adminprotect,getusers) //get users
router.get("/user/:id/view", protect,adminprotect,getuserbyid)
router.get("/jobs", protect,adminprotect,getjobs) //get jobs
router.get("/jobs/:id", protect,adminprotect,getjobsbyid) //get by detail
router.patch("/jobs/:id/forced", protect,adminprotect,updateforced)
router.get("/dashboard", protect,adminprotect, getAdminDashboardInfo);
export default router;