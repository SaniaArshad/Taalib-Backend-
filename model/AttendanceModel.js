const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    studentID: {
        type: String,
        required: true
    },
    teacherID: {
        type: String,
        required: true
    },
    courseID: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    isPresent: {
        type: Boolean,
        default: false
    },
},
{timestamps:true});

const Attendance = mongoose.model("Attendance", AttendanceSchema);
module.exports = Attendance;