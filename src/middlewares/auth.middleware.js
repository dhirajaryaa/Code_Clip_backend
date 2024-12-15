import { AsyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js"

export const AuthUser = AsyncHandler(async (req, _, next) => {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
        throw new ApiError(403, "AnAuthorized Access!")
    }

    const decodedToken = await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    if (!decodedToken) {
        throw new ApiError(403, "Invalid Token!")
    }

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

    req.user = user
    next()
});