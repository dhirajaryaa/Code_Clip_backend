import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import {AuthUser} from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"

export const userRouter = Router();

// create routes 
userRouter.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }
    ]),
    registerUser);

userRouter.route("/login").post(loginUser);
// secure routes with middleware 
userRouter.route("/logout").post(AuthUser,logoutUser);