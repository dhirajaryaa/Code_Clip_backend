import { AsyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../services/cloudinary.services.js"

const generateAccessAndRefreshToken = async (userId) => {
    if (!userId) {
        throw new ApiError(404, "User not found!");
    }

    const user = await User.findById(userId).select("+refreshToken");

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
};

let cookieOptions = {
    httpOnly: true,
    secure: true
};

const registerUser = AsyncHandler(async (req, res, next) => {

    const { fullName, username, email, password } = req.body;

    if ([fullName, username, email, password].some((field) => (field?.trim() === ""))) {
        throw new ApiError(400, "All fields are required.");
    }

    const userExists = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (userExists) {
        throw new ApiError(422, "User already exists.");
    }

    const avatarLocalFilePath = req.files?.avatar[0]?.path;

    if (!avatarLocalFilePath) {
        throw new ApiError(422, "Avatar is required.");
    }

    const avatar = await uploadOnCloudinary(avatarLocalFilePath);

    if (!avatar) {
        throw new ApiError(500, "Failed to upload avatar to Cloudinary.");
    }

    const userCollection = await User.create({
        fullName,
        username: username?.toLowerCase(),
        email,
        password,
        avatar
    });

    const userData = await User.findById(userCollection?._id).select("-password -refreshToken");

    return res.status(201).json(
        new ApiResponse(201, "User registered successfully.", userData)
    );
});

const loginUser = AsyncHandler(async (req, res, next) => {

    const { email, username, password } = req.body;

    if (!(email || username)) {
        throw new ApiError(400, "Email or username is required.");
    }
    if (!password) {
        throw new ApiError(400, "Password is required.");
    }

    const userExists = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (!userExists) {
        throw new ApiError(404, "User not found.");
    }

    const isPasswordMatch = await userExists.isPasswordCorrect(password);

    if (!isPasswordMatch) {
        throw new ApiError(401, "Incorrect password.");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(userExists?._id);

    const userData = await User.findById(userExists?._id).select("-password -refreshToken");

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(200, "Login successful.", {
                user: userData,
                accessToken,
                refreshToken,
            })
        );
});

const logoutUser = AsyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(req.user?._id, {
        $set: {
            refreshToken: ""
        }
    }, {
        new: true
    });

    return res
        .status(200)
        .cookie("accessToken", undefined, cookieOptions)
        .cookie("refreshToken", undefined, cookieOptions)
        .json(
            new ApiResponse(200, "Logout successful.", {
                accessToken: undefined,
                refreshToken: undefined,
            })
        );
});
