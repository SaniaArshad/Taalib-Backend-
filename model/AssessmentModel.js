const mongoose = require('mongoose');
//mongooooose

const AssesmentSchema = new mongoose.Schema({
    typeOfAssessment: {
        type: String,
        required: true
    },
    totalMarks: {
        type: Number,
        required: true
    },
    obtainedMarks: {
        type: Number,
        required: true
    },
    weightage: {
        type: Number,
        required: true
    },
    courseID: {
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

const Assesment = mongoose.model('Assesment', AssesmentSchema);
module.exports = Assesment;