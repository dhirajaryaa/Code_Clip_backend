import { Router } from "express";
import { AddNewComment } from "../controllers/comment.controller.js";
import { AuthUser } from "../middlewares/auth.middleware.js"


export const commentRouter = Router();

commentRouter.route("/add").post(AuthUser, AddNewComment);