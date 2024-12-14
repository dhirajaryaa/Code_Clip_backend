import mongoose from "mongoose";


const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true,
        enum: [
            '#FF6B6B',
            '#FFA351',
            '#FFD93D',
            '#6BCB77',
            '#4ECDC4',
            '#4D96FF',
            '#9A7DFF',
            '#FF88CC',
            '#CED4DA',
            '#B5838D',
        ],
        default: "#CED4DA"
    }
});


export const Tag = mongoose.model('Tag', tagSchema);