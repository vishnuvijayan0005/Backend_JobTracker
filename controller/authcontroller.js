import { dbcompany, register } from "../helpers/authHelper.js";
import User from "../model/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
export const authRegistration = async (req, res) => {
  try {
    const user = await register(req.body);



    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data:user
    });
  } catch (error) {
    console.error("Controller error:", error.message);

    return res.status(400).json({
      success: false,
      message: error.message || "Registration failed",
    });
  }
};

export const companyreg = async (req, res) => {
  try {
    const user = await dbcompany(req.body);
    // console.log(user);

    return res.status(201).json({
      success: true,
      message: "company registered successfully",
      user,
    });
  } catch (error) {
    console.error("Controller error:", error.message);

    return res.status(400).json({
      success: false,
      message: error.message || "Registration failed",
    });
  }
};
export const userlogin = async (req, res) => {
  const { email, password } = req.body;

  const userInfo = await User.findOne({ email });
  if (!userInfo) {
    return res.status(401).json({ message: "User not registered" });
  }
if(!userInfo.approved){
 return res.status(401).json({ message: "verification under process!Please check you email or contact admin " });
}
if(userInfo.isblocked){
 return res.status(401).json({ message: "You are temporarily blocked by admin.. " });
}
  const isMatch = await bcrypt.compare(password, userInfo.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: userInfo._id, role: userInfo.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

const isProduction = process.env.NODE_ENV === "production";


res.cookie("token", token, {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 24 * 60 * 60 * 1000,
});


  res.status(200).json({
    success: true,

    user: {
    //   email: userInfo.email,
      role: userInfo.role,
    //   id: userInfo._id,
    //   name:userInfo.name,
    //   isprofilefinished:userInfo.isprofilefinished,
    },
  });
};

export const logout = (req, res) => {
  res.clearCookie("token", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
});

  res.status(200).json({ success: true });
};
``;
export const checkcontroll = async(req, res) => {
  const userdata=await User.findById(req.user.id)


  res.status(200).json({
    success: true,
    user: {
    
    
      role:userdata.role,
      email:userdata.email,
      isprofilefinished:userdata.isprofilefinished
    },
  });
};






export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    // console.log("User found:", user);

    if (!user) {
      return res.json({
        success: true,
        message: "If an account exists, a reset link has been sent.",
      });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");
    // console.log("Reset token:", resetToken);

    // Hash token before saving
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpire = Date.now() + 5 * 60 * 1000; // 15 min

    try {
      await user.save({ validateBeforeSave: false });
      // console.log("User saved with reset token");
    } catch (err) {
      console.error("Error saving user:", err);
      return res.status(500).json({ message: "Failed to save reset token" });
    }

    const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
    const resetUrl = `${clientUrl}/auth/reset-password/${resetToken}`;
    // console.log("Reset URL:", resetUrl);

    res.json({
      success: true,
      message: "Reset link generated",
      resetUrl,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



export const resetPassword = async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user)
    return res.status(400).json({ message: "Invalid or expired token" });
// console.log(user);
const hashedPassword=await bcrypt.hash(password, 10)
  user.password = hashedPassword; 
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.json({ success: true, message: "Password reset successful" });
};
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Verification token missing",
      });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

   
    const user = await User.findOne({
      emailVerifyToken: hashedToken,
      emailVerifyExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.redirect(
      `${process.env.CLIENT_URL}/auth/verify-failed`
    );
    }

    user.isEmailVerified = true;
    user.approved = true;

    user.emailVerifyToken = undefined;
    user.emailVerifyExpires = undefined;

    await user.save();

    return res.redirect(
      `${process.env.CLIENT_URL}/auth/verify-success`
    );
  } catch (error) {
    console.error("Email verification error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error during verification",
    });
  }
};