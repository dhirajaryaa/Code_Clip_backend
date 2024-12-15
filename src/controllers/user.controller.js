import { AsyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../services/cloudinary.services.js"

const generateAccessAndRefreshToken = async (userId) => {
    if (!userId) {
        throw new ApiError(400, "User not found!")
    };

    const user = await User.findById(userId).select("+refreshToken");

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken }
};

let cookieOptions = {
    httpOnly:true,
    secure:true
}

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
});

const loginUser = AsyncHandler(async (req, res, next) => {

    const { email, username, password } = req.body;

    if (!(email || username)) {
        throw new ApiError(400, "Email or Username is Required!")
    };
    if (!password) {
        throw new ApiError(400, "Password is Required!")
    };

    const userExits = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (!userExits) {
        throw new ApiError(403, "User not Existed");
    };

    const isPasswordMatch = await userExits.isPasswordCorrect(password);

    if (!isPasswordMatch) {
        throw new ApiError(401, "Password not matched!");
    };

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(userExits?._id);

    const userData = await User.findById(userExits?._id).select("-password -refreshToken");

    return res
        .status(200)
        .cookie("accessToken", accessToken,cookieOptions)
        .cookie("refreshToken", refreshToken,cookieOptions)
        .json(
            new ApiResponse(200, {
                user:userData,
                accessToken,
                refreshToken,
            }, "Login Successful")
        )
});

 


export { registerUser, loginUser }