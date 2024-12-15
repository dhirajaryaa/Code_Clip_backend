import { v2 as cloudinary } from "cloudinary";
import fs from "fs"

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            console.error("File path empty!");
        };
        const res = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        })

        await fs.unlinkSync(localFilePath);
        // return file link 
        return res.url
    } catch (error) {
        await fs.unlinkSync(localFilePath);
        console.error("Failed to upload on Cloudinary", error);

    }
};

const removeOnCloudinary = async (filePath) => {
    try {
        if (!filePath) {
            console.error("File path empty!");
        };
        const res = await cloudinary.uploader.destroy(filePath)
        // return response
        return res
    } catch (error) {
        console.error("Failed to destroy on Cloudinary", error);

    }
}

export { uploadOnCloudinary, removeOnCloudinary };