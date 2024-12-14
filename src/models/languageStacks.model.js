import mongoose from "mongoose";

const languageStacksSchema = new mongoose.Schema({
    language: {
        type: mongoose.Types.ObjectId,
        ref: "Language"
    },
    total: {
        type: Number,
        default: 0
    }
});


export const LanguageStack = mongoose.model('LanguageStack', languageStacksSchema);