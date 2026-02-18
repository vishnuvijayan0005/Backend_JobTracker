import bcrypt from "bcrypt";
import User from "../model/User.js";
import Company from "../model/CompanySchema.js";
import UserProfile from "../model/UserProfileSchema.js";




export const register = async (userData) => {
  const { firstName,middleName,lastName, email,phone ,password } = userData;
  // console.log(userData);

  try {
    if (!firstName ||!lastName|| !email || !password) {
      throw new Error("All fields are required");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

   const user = await User.create({
  name: `${firstName} ${lastName}`.trim(),
  email,
  password: hashedPassword,
  isProfileFinished: false,
});
await UserProfile.create({
      
userId:user._id,
      firstName,
      middleName,
      lastName,
      phone,
     
    });
    return user;
  } catch (error) {
    console.error("Register helper error:", error.message);
    throw error;
  }
};

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
