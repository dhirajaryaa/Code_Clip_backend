import { app } from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./db/index.js"
import { v2 as cloudinary } from "cloudinary";

// dotenv configure 
dotenv.config({
    path: "./.env"
});

// cloudinary configure 
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// connection Database
connectDB()
    .then(() => {
        app.listen(process.env.PORT || 5000, () => {
            console.log("Express Server Listen on : ", process.env.PORT || 5000);
        })
    })
    .catch((err) => {
        console.error("MongoDB connection Error:", err);
        process.exit(1);
    })
