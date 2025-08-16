import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadonCloudinary = async (localfilepath) => {
  try {
    if (!localfilepath) return null;
    const response = await cloudinary.uploader.upload(localfilepath, {
      resource_type: "auto",
    });
    console.log("File uploaded on Cloudinary.File src : " + response.url);
    // deleting file after upload
    fs.unlink(localfilepath);
    return response;
  } catch (error) {
    fs.unlink(localfilepath);
    return null;
  }
};

const deletefromCloudinary = async (publicId) => {
  try {
    const result = cloudinary.uploader.destroy(publicId);
    console.log("file deleted from cloudinary");
  } catch (error) {
    console.log("error in deleting the file", error);
    return null;
  }
};
export { uploadonCloudinary, deletefromCloudinary };
