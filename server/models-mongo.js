// models-mongo.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    cpassword: {
        type: String,
        required: true,
    },
    confirmPassword: {
        type: String,
        required: true,
    },
});

const coordinatorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    cpassword: {
        type: String,
        required: true,
    },
    confirmPassword: {
        type: String,
        required: true,
    },
});

const guideSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    cpassword: {
        type: String,
        required: true,
    },
    confirmPassword: {
        type: String,
        required: true,
    },
});

const review1Schema = new mongoose.Schema({
    guideEmail: {
        type: String,
        required: true,
        ref: 'Guide',
    },
    studentEmail: {
        type: String,
        required: true,
        ref: 'Student',
    },
    topic1: {
        type: String,
        required: true,
        unique: true,
    },
    topic2: {
        type: String,
        required: true,
        unique: true,
    },
    topic3: {
        type: String,
        required: true,
        unique: true,
    },
});

const review1ResultsSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    topic: {
        type: String,
        required: true,
        unique: true,
    },
    marks: {
        type: String,
        required: true,
    },
});

const review2ResultsSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    marks: {
        type: String,
        required: true,
    },
});

const review3ResultsSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    marks: {
        type: String,
        required: true,
    },
});

const pptSchema = new mongoose.Schema({
    guideEmail: {
        type: String,
        required: true,
        ref: 'Guide',
    },
    studentEmail: {
        type: String,
        required: true,
        ref: 'Student',
    },
    filename: {
        type: String,
        required: true,
    },
    pptData: {
        type: Buffer,
        required: true,
    },
});

const ppt3Schema = new mongoose.Schema({
    guideEmail: {
        type: String,
        required: true,
        ref: 'Guide',
    },
    studentEmail: {
        type: String,
        required: true,
        ref: 'Student',
    },
    filename: {
        type: String,
        required: true,
    },
    pptData: {
        type: Buffer,
        required: true,
    },
});

const selectedPairSchema = new mongoose.Schema({
    studentId: {
      type: String,
      required: false,
    },
    student_name: {
      type: String,
      required: true,
    },
    student_email: {
      type: String,
      required: true,
    },
    guideId: {
      type: String,
      required: false,
    },
    guide_name: {
      type: String,
      required: true,
    },
    guide_email: {
      type: String,
      required: true,
    },
  });
  
const SelectedPair = mongoose.model('SelectedPair', selectedPairSchema);
const Student = mongoose.model('Student', studentSchema);
const Coordinator = mongoose.model('Coordinator', coordinatorSchema);
const Guide = mongoose.model('Guide', guideSchema);
const Review1 = mongoose.model('Review1', review1Schema);
const Review1Results = mongoose.model('Review1Results', review1ResultsSchema);
const Review2Results = mongoose.model('Review2Results', review2ResultsSchema);
const Review3Results = mongoose.model('Review3Results', review3ResultsSchema);
const Ppt = mongoose.model('Ppt', pptSchema);
const Ppt3 = mongoose.model('Ppt3', ppt3Schema);

module.exports = {
    Student,
    Coordinator,
    Guide,
    Review1,
    Review1Results,
    Review2Results,
    Review3Results,
    Ppt,
    Ppt3,
    SelectedPair
};
