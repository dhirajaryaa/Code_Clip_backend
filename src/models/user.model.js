import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        trim: true,
        index: true, // for better indexing on database  
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
    },
    avatar: {
        type: String,
    },
    isFavorite: [{
        type: String,
        required: true,
    }],
    snippets: [{
        type: mongoose.Types.ObjectId,
        ref: "Snippet"
    }]

}, { timestamps: true });

// password to hash 
userSchema.pre("save", async function (next) {
    if (this.isModified) return null
    this.password = await bcrypt.hash(this.password, 10);
    next()
});
// custom methods 
userSchema.methods.isPasswordCorrect(async function (password) {
    return await bcrypt.compare(password, this.password);
});

userSchema.methods.generateAccessToken(async function () {
    return await jwt.sign({
        _id: this._id,
        username: this.username,
        email: this.email
    },
        process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
    )
});
userSchema.methods.generateRefreshToken(async function () {
    return await jwt.sign({
        _id: this._id
    },
        process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
    )
});


export const User = mongoose.model("User", userSchema);