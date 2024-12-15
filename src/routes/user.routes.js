import { Router } from "express";
import { deleteUserAccount, loginUser, logoutUser, refreshAccessToken, registerUser, updateUserAvatar, updateUserPassword, updateUserProfile } from "../controllers/user.controller.js";
import { AuthUser } from "../middlewares/auth.middleware.js"
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
userRouter.route("/logout").post(AuthUser, logoutUser);

userRouter.route("/refresh-token").post(AuthUser, refreshAccessToken);

userRouter.route("/update-profile").put(AuthUser, updateUserProfile);

userRouter.route("/update-password").put(AuthUser, updateUserPassword);

userRouter.route("/update-avatar").put(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }
    ]), AuthUser,
    updateUserAvatar);

userRouter.route("/delete-user").delete(AuthUser, deleteUserAccount);