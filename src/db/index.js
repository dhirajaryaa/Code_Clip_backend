import mongoose from "mongoose";


export const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
        console.log("Database Connected");
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1);
    }
};