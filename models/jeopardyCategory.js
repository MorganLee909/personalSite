const mongoose = require("mongoose");

const JeopardyCategorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: String,
    questions: [{
        question: {
            type: String,
            required: true
        },
        answer: {
            type: String,
            required: true
        }
    }]
});

module.exports = mongoose.model("JeopardyCategory", JeopardyCategorySchema);