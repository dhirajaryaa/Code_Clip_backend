import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

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

app.use(cookieParser());

// setup routes 
import { userRouter } from "./routes/user.routes.js"
import { commentRouter } from "./routes/comment.routes.js";
// users routes 
app.use("/api/users", userRouter);
// comments routes 
app.use("/api/comments", commentRouter);