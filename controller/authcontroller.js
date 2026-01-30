import { dbcompany, register } from "../helpers/authHelper.js";
import User from "../model/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const authRegistration = async (req, res) => {
  try {
    const user = await register(req.body);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
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

  const userInfo = await User.findOne({ email, approved: true });
  if (!userInfo) {
    return res.status(401).json({ message: "User not registered" });
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

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000,
  });


  res.status(200).json({
    success: true,

    user: {
      email: userInfo.email,
      role: userInfo.role,
      id: userInfo._id,
      name:userInfo.name,
      isprofilefinished:userInfo.isprofilefinished,
    },
  });
};

export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({ success: true });
};
``;
export const checkcontroll = async(req, res) => {
  const userdata=await User.findById(req.user.id)


  res.status(200).json({
    success: true,
    user: {
      id:userdata._id,
      name:userdata.name,
      role:userdata.role,
      email:userdata.email,
      isprofilefinished:userdata.isprofilefinished
    },
  });
};
