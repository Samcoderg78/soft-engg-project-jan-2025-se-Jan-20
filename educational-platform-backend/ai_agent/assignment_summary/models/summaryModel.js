// assignment-summary/models/summaryModel.js
const mongoose = require('mongoose');

const summarySchema = new mongoose.Schema({
    assignmentId: { type: String, required: true }, // Assignment ID
    totalStudents: { type: Number, required: true }, // Total students who attempted the assignment
    averageScore: { type: Number, required: true }, // Average score of the assignment
    highestScore: { type: Number, required: true }, // Highest score in the assignment
    lowestScore: { type: Number, required: true }, // Lowest score in the assignment
    commonMistakes: { type: [String], default: [] }, // Common mistakes made by students
    difficultyStats: { // Difficulty-wise statistics
        easy: {
            totalQuestions: { type: Number, required: true },
            correctAnswers: { type: Number, required: true },
            averageScore: { type: Number, required: true }
        },
        medium: {
            totalQuestions: { type: Number, required: true },
            correctAnswers: { type: Number, required: true },
            averageScore: { type: Number, required: true }
        },
        hard: {
            totalQuestions: { type: Number, required: true },
            correctAnswers: { type: Number, required: true },
            averageScore: { type: Number, required: true }
        }
    },
    createdAt: { type: Date, default: Date.now } // Timestamp
});

module.exports = mongoose.model('Summary', summarySchema);