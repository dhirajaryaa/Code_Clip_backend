import mongoose from "mongoose";

const languageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim:true,
        unique:true,
        lowercase:true
    }
}, {
    timestamps: true
});


export const Language = mongoose.model('Language', languageSchema);