const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    instructor: {
      type: String,
      required: true
    },    
    taughtToClass:{
      type: Number,
      required: true
    }
  });

const TeacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  employeeId: {
    type: Number,
    required: true,
    unique: true
    },
  courses: {
    type: [CourseSchema],
    required: true
    },
    role: {
    type: String,
    default: "Teacher",
    required: true
  },
  joiningDate: {
    type: Date,
    default: Date.now
  }
});

const Teacher = mongoose.model('Teacher', TeacherSchema);
module.exports = Teacher;
