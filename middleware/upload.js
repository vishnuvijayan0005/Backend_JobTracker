import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const upload = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
      if (file.fieldname === "photo") {
        return {
          folder: "ProfileImages",
          allowed_formats: ["jpg", "jpeg", "png", "webp"],
        };
      }
      if (file.fieldname === "resume") {
        return {
          folder: "Resumes",
          resource_type: "raw",
          allowed_formats: ["pdf", "doc", "docx"],
        };
      }
      throw new Error("Invalid field name");
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
});

export default upload;
