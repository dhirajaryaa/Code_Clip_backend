import { app } from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./db/index.js"
// dotenv configure 
dotenv.config({
    path: "./.env"
});


// connection Database
connectDB()
    .then(() => {
        app.listen(process.env.PORT || 5000, () => {
            console.log("Express Server Listen on : ", process.env.PORT || 5000);
        })
    })
    .catch((err)=>{
        console.error("MongoDB connection Error:",err);
        process.exit(1);
    })
