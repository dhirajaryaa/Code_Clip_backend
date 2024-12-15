import { AsyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../services/cloudinary.services.js"


const registerUser = AsyncHandler(async (req, res, next) => {

    const { fullName, username, email, password } = req.body;

    if ([fullName, username, email, password].some((filed) => (filed?.trim() === ""))) {
        throw new ApiError(400, "All Field is Required!");
    };

    const userExits = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (userExits) {
        throw new ApiError(401, "User Already Exited!");
    };

    const avatarLocalFilePath = req.files?.avatar[0].path;

    if (!avatarLocalFilePath) {
        throw new ApiError(401, "Avatar is Required!");
    };

    const avatar = await uploadOnCloudinary(avatarLocalFilePath);

    if (!avatar) {
        throw new ApiError(401, "Fail to upload on cloudinary");
    };

    const userCollection = await User.create({
        fullName,
        username: username?.toLowerCase(),
        email,
        password,
        avatar
    });

    const userData = await User.findById(userCollection?._id).select("-password -refreshToken")
    return res.status(201).json(
        new ApiResponse(201, "User Register successfully", userData)
    )
})


export { registerUser }