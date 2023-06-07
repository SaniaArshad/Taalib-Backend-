const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const {Student, Course, FeeChalan} = require('../model/StudentModel.js');
const Assesment = require('../model/AssessmentModel');
const Feedback = require('../model/FeedbackModel');
const Attendance = require('../model/AttendanceModel');
const stripe = require('stripe')( process.env.STRIPE_SECRET_KEY);

let auth = (req , res , next)=>{
  let token = req.headers['token'];
  jwt.verify(token , process.env.JWT_SECRET , (err , decoded)=>{
      if(!err){
          req.decoded = decoded;
          next();
      }else{
          res.status(403).json({"Message":"Not Authorized"})
      }
  });
};

// Login student
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find student by email
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    if (password !== student.password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create and sign JWT token
    const payload = {
      student: {
        id: student.id
      }
    };
    
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({ token, student });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// View marks of a student
router.get('/marks/:studentID', auth, async (req, res) => {
  try {
    const { studentID } = req.params;

    // Find student by ID
    const student = await Student.findById(studentID);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Find assessments by studentID
    const assessments = await Assesment.find({ studentID });

    // Extract marks, teacher, and course information from assessments
    const marks = assessments.map((assessment) => ({
      typeOfAssessment: assessment.typeOfAssessment,
      totalMarks: assessment.totalMarks,
      obtainedMarks: assessment.obtainedMarks,
      weightage: assessment.weightage,
      teacher: assessment.teacherID, 
      course: assessment.courseID, 
    }));

    // Find courses by ID
    const courses = await Course.find({ _id: { $in: marks.map((mark) => mark.course) } });

    res.json({ student, marks, courses });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// View attendance for a student
router.get('/attendance/:studentId', auth,  async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
      
    }

    const attendance = await Attendance.find({ studentID: studentId });

    res.json({ student, attendance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route for enrolling in a course
router.post('/enroll',auth, async (req, res) => {
  try {
    const { studentId, courseId } = req.body;

    // Find student
    console.log(studentId);
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Find course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if student is already enrolled in the course
    const isEnrolled = student.courses.some((enrolledCourse) => enrolledCourse._id.toString() === courseId);
    if (isEnrolled) {
      return res.status(400).json({ message: 'Student is already enrolled in the course' });
    }

    // Enroll student in the course
    student.courses.push(course);
    await student.save();

    res.json({ message: 'Student enrolled in the course successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Add anonymous feedback
router.post('/feedback',auth, async (req, res) => {
  const {studentID, feedback, teacherID } = req.body;

  try {
    const newFeedback = new Feedback({
      feedback,
      studentID,
      teacherID, // Use the provided teacher ID
    });

    // Save the feedback to the database
    await newFeedback.save();

    res.status(200).json({ message: 'Anonymous feedback added successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});


// Route for processing fee payment
router.post('/payment', auth, async (req, res) => {
  try {
    const { studentID, amount, token } = req.body;
    
    // Retrieve student information
    const student = await Student.findById(studentID);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    // Create a new charge using Stripe
    const charge = await stripe.charges.create({
      amount: amount * 100, // Stripe accepts amount in cents
      currency: 'usd',
      source: token, // Payment token received from the client
      description: 'Fee Payment',
    });
    
    // Update fee payment status in the database
    const feeChalan = new FeeChalan({
      studentID,
      isPaid: true,
      pathToFile: charge.receipt_url,
    });
    await feeChalan.save();
    
    // Update student's fee payment status
    student.isFeePaid = true;
    await student.save();
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Payment failed' });
  }
});

//view fee chalan
router.get('/:studentId/fee-chalan',auth, async (req, res) => {
  const studentId = req.params.studentId;

  try {
    // Find the student by ID
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Retrieve the fee chalan from the student
    const feeChalan = student.feeChalan;

    res.json(feeChalan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});




module.exports = router;

