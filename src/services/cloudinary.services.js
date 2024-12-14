import { v2 as cloudinary } from "cloudinary";

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            console.error("File path empty!");
        };
        const res = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        })
        // return file link 
        return res.url
    } catch (error) {
        console.error("Failed to upload on Cloudinary", error);

    }
};


export {uploadOnCloudinary}