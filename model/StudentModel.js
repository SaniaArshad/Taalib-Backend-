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
  credits: {
    type: Number,
    required: true
  },
  taughtToClass:{
    type: Number,
    required: true
  },
  registrationDate: {
    type: Date,
    default: Date.now
  }
});


const FeeChalanSchema = new mongoose.Schema({
  studentID: {
      type: String,
      required: true
  },
  isPaid:{
      type: Boolean,
      required: true,
      default: false
    },
  pathToFile:{
        type: String,
        required: true
    }
});

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  rollNumber: {
    type: Number,
    required: true,
    unique: true
    },
  email: {
    type: String,
    required: true,
    unique: true
  },
  class:{
    type: Number,
    required: true
  },
  courses: {
  type: [CourseSchema]
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  password: {
    type: String,
    required: true
  },
  isFeePaid:{
    type: Boolean,
    required: true
  },
  role: {
    type: String,
    default: "Student",
    required: true
  },
  feeChalan:{
    type: [FeeChalanSchema],
    required: true
  }
});

const Course = mongoose.model('Course', CourseSchema);
const Student = mongoose.model('Student', StudentSchema);
const FeeChalan = mongoose.model('FeeChalan', FeeChalanSchema);

module.exports = { Course, Student, FeeChalan};
