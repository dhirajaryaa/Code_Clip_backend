import { AsyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary, removeOnCloudinary } from "../services/cloudinary.services.js"

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
        avatar: {
            url: avatar.url,
            public_id: avatar.public_id
        }
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

const updateUserPassword = AsyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!(oldPassword, newPassword) && !(oldPassword === newPassword)) {
        throw new ApiError(400, "All  Fields is Required ");
    };
    const currentUser = await User.findById(req.user?._id).select("+password");

    const isPasswordMatch = await currentUser.isPasswordCorrect(oldPassword);

    if (!isPasswordMatch) {
        throw new ApiError(400, "Invalid password");
    };

    currentUser.password = newPassword;

    await currentUser.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(200, {}, "Password update successful")
    )

});

const updateUserProfile = AsyncHandler(async (req, res) => {
    const { fullName, username } = req.body;

    if (!fullName || !username) {
        throw new ApiError(400, "All  Fields is Required ");
    };
    const updatedUser = await User.findByIdAndUpdate(req.user?._id, {
        $set: {
            fullName: fullName || req.user?.fullName,
            username: username.toLowerCase() || req.user?.username
        }
    }, { new: true }).select("-password -refreshToken")

    return res.status(200).json(
        new ApiResponse(200, updatedUser, "user profile update successful")
    )
});

const updateUserAvatar = AsyncHandler(async (req, res) => {
    const oldAvatarId = req.user?.avatar.public_id;
    const avatarLocalFilePath = req.files?.avatar[0].path;

    if (!avatarLocalFilePath) {
        throw new ApiError(400, "Avatar is Required ");
    };

    const avatar = await uploadOnCloudinary(avatarLocalFilePath);
    if (!avatar) {
        throw new ApiError(500, "Failed to upload avatar to Cloudinary.");
    }

    await removeOnCloudinary(oldAvatarId);

    await User.findByIdAndUpdate(req.user?._id, {
        $set: {
            avatar: {
                url: avatar.url,
                public_id: avatar.public_id
            }
        }
    }, { new: true });

    return res.status(200).json(
        new ApiResponse(200, {}, "user Avatar updated")
    )
});

const refreshAccessToken = AsyncHandler(async (req, res) => {
    if (!req.user._id) {
        throw new ApiError(404, "Invalid Access")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(req.user?._id);

    if (!(accessToken && refreshToken)) {
        throw new ApiError(404, "Invalid credential");
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(200, {
                accessToken,
                refreshToken
            }, "Access Token Refreshed!")
        )

});

const deleteUserAccount = AsyncHandler(async (req, res) => {

    const user = await User.findById(req.user?._id);
    if (!user) {
        throw new ApiError(400, "User Not Found!")
    };

    const avatar = user.avatar;
    console.log(avatar);


    await User.findByIdAndDelete(user._id);
    await removeOnCloudinary(avatar.public_id);
    

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "User Account Deleted!")
        )
});

export {
    registerUser,
    loginUser,
    logoutUser,
    updateUserPassword,
    updateUserProfile,
    updateUserAvatar,
    refreshAccessToken,
    deleteUserAccount
}