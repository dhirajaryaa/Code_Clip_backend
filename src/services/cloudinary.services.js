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

const removeOnCloudinary = async (filePath) => {
    try {
        if (!filePath) {
            console.error("File path empty!");
        };
        const res = await cloudinary.uploader.destroy(filePath, {
            resource_type: 'auto'
        })
        // return response
        return res
    } catch (error) {
        console.error("Failed to destroy on Cloudinary", error);

    }
}

export { uploadOnCloudinary, removeOnCloudinary };