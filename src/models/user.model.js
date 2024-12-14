import mongoose from "mongoose";

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
        ref: "snippet"
    }]

}, { timestamps: true });


export const User = mongoose.model("User", userSchema);