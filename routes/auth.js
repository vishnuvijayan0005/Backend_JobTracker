import express from "express";
import { authRegistration, checkcontroll, companyreg, forgotPassword, logout, resetPassword, userlogin, verifyEmail } from "../controller/authcontroller.js";
import { protect } from "../middleware/protect.js";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("respond with a resource");
});

router.post("/registration", authRegistration);
router.post("/register-company",companyreg );
router.post("/login", userlogin);
router.post("/logout",logout)
router.get("/checkme",protect,checkcontroll)
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/verify-email/:token", verifyEmail);
// router.get("/user",protect,checkcontrolluser)
// router.get("/admin",protect,checkcontrolladmin)
// router.get("/companyadmin",protect,checkcontrollcompanyadmin)
export default router;
