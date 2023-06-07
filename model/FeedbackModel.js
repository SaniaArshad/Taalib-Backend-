const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    feedback: {
        type: String,
        required: true
    },
    studentID: {
        type: String,
        required: true
    },
    teacherID: {
        type: String,
        required: true
    }
});

const Feedback = mongoose.model('Feedback', FeedbackSchema);
module.exports = Feedback;