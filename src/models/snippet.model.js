import mongoose from "mongoose";

const snippetSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    code: {
        type: String,
        required: true
    },
    tags: [{
        type: mongoose.Types.ObjectId,
        ref: "Tag"
    }],
    languages: [{
        type: mongoose.Types.ObjectId,
        ref: "Language"
    }],
    comments: [{
        type: mongoose.Types.ObjectId,
        ref: "Comment"
    }],
    isTrash: {
        type: Boolean,
        default: false,
    },
    isPrivate: {
        type: Boolean,
        required: true,
        default: true,
    },
    likes: [{
        type: mongoose.Types.ObjectId,
        ref: "User"
    }],
    author: [{
        type: mongoose.Types.ObjectId,
        ref: "User"
    }],
}, { timestamps: true });

export const Snippet = mongoose.model("Snippet", snippetSchema);