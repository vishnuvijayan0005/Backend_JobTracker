import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {



  
  try {
    // 1️⃣ Read token from cookies
    const token = req.cookies.token;
// console.log(token);


    if (!token) {
      return res.status(401).json({ success:false,message: "Not authenticated" });
    }
 
    // 2️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3️⃣ Attach user info
    req.user = decoded;

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid or expired session" });
  }
};
