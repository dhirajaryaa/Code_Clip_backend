import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    snippetId: {
        type: mongoose.Types.ObjectId,
        ref: "Snippet"
    }
}, {
    timestamps: true
});


export const Comment = mongoose.model('Comment', commentSchema);