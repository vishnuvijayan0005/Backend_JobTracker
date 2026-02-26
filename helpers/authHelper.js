import bcrypt from "bcrypt";
import User from "../model/User.js";
import Company from "../model/CompanySchema.js";
import UserProfile from "../model/UserProfileSchema.js";
import crypto from "crypto";



export const register = async (userData) => {
  const {
    firstName,
    middleName,
    lastName,
    email,
    phone,
    password,
  } = userData;

  try {
    // 1️⃣ Validate required fields
    if (!firstName || !lastName || !email || !password) {
      throw new Error("All required fields must be provided");
    }

    // 2️⃣ Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);


    const verifyToken = crypto.randomBytes(32).toString("hex");
    const hashedVerifyToken = crypto
      .createHash("sha256")
      .update(verifyToken)
      .digest("hex");


    // 5️⃣ Create user
    const user = await User.create({
      name: `${firstName} ${lastName}`.trim(),
      email,
      password: hashedPassword,
      isProfileFinished: false,
      emailVerifyToken: hashedVerifyToken,
      emailVerifyExpires: Date.now() + 24 * 60 * 60 * 1000, 
    });

   
    await UserProfile.create({
      userId: user._id,
      firstName,
      middleName,
      lastName,
      phone,
    });

  
    return {
      email,
      verifyToken, 
    };

  } catch (error) {
    console.error("Register helper error:", error.message);
    throw error;
  }}

export const dbcompany = async (companyData) => {
  // console.log(companyData);
// console.log(companyData);

  const {
    companyName,
    companyLocation,
    category,
    phone,
    website,
    email,
    password,
  } = companyData;


  try {
    if (
      !companyName ||
      !companyLocation ||
      !email ||
      !phone ||
      !category ||
      !password
    ) {
      throw new Error("All fields are required");
    }

    const existingUser = await Company.findOne({ email });
    if (existingUser) {
      throw new Error("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const companyUser = await Company.create({
      companyName,
      Companylocation:companyLocation,
      companyfield: category,
      phone: phone,
      siteid: website,
      email,
      approved: false,
    });

    const exist = await User.findOne({ email });
    if (exist) {
      throw new Error("User already registered");
    }
    const user = await User.create({
      name: companyName,
      email,
      role: "companyadmin",
      password: hashedPassword,
      approved: false,
      companyid: companyUser._id,
    });
    companyUser.userId = user._id;
    await companyUser.save();
    return (companyUser, user);
  } catch (error) {
    console.error("Register helper error:", error.message);
    throw error;
  }
};
