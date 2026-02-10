import express from 'express';
import {  getcompaniesbyid, getcompanyadminlist, getjobs, getjobsbyid, getusers, updatecompanypresence, updatecompanystatus, updateforced } from '../controller/superadminController.js';
import { getcompanylist } from '../controller/userController.js';
const router = express.Router();



router.get("/companies",getcompanyadminlist) //companies
router.get("/companies/:id",getcompaniesbyid) //company by id
router.patch("/companyupdate/:id/status",updatecompanystatus) //approve or disable
router.patch("/company/:id/status",updatecompanypresence) 
router.get("/users",getusers) //get users
router.get("/jobs",getjobs) //get jobs
router.get("/jobs/:id",getjobsbyid) //get by detail
router.patch("/jobs/:id/forced",updateforced)
export default router;