import {v2 as cloudinary} from "cloudinary";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();


cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
})

export const uploadToCloudinary=async (filePath,fileName) => {
  const allowExts=[".jpg", ".jpeg", ".png", ".gif", ".webp"];
  const ext=path.extname(fileName).toLowerCase();

  if (!allowExts.includes(ext)) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw new Error("Invalid file type. Only image files are allowed.");
  }

  const result=await cloudinary.uploader.upload(filePath,{
    folder:"Documents",
    resource_type:"image",
    use_filename:true,
    unique_filename:false,
    public_id: path.basename(fileName, ext),
  })

  if(fs.existsSync(filePath)){
    fs.unlinkSync(filePath);
  }
  return result.secure_url;
}
