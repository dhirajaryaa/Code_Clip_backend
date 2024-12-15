import express from "express";
import cors from "cors";

// export app 
export const app = express();

// setup middleware 

app.use(express.json({
    limit: process.env.LIMIT
}));

app.use(express.urlencoded({
    limit: process.env.LIMIT,
    extended: true
}));

app.use(express.static("./public"));

app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true
}));

// setup routes 
import { userRouter } from "./routes/user.routes.js"

app.use("/api/users", userRouter);
