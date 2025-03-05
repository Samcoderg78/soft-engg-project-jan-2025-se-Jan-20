// assignment-summary/services/summaryService.js
const AssignmentScore = require('../../../assignment/model/assignmentScore'); // Import assignmentScore model
const AssignmentResponse = require('../../../assignment/model/assignmentResponse'); // Import assignmentResponse model
const AssignmentQuestion = require('../../../assignment/model/assignmentQuestion'); // Import assignmentQuestion model
const Summary = require('../models/summaryModel');

// Generate summary report for a specific assignment
const generateSummaryReport = async (assignmentId) => {
    try {
        // Fetch all scores for the assignment
        const assignmentScores = await AssignmentScore.find({ assignment_id: assignmentId });

        if (assignmentScores.length === 0) {
            throw new Error('No scores found for this assignment.');
        }

        // Calculate summary statistics
        const totalStudents = assignmentScores.length;
        const scores = assignmentScores.map(score => score.score);
        const averageScore = scores.reduce((a, b) => a + b, 0) / totalStudents;
        const highestScore = Math.max(...scores);
        const lowestScore = Math.min(...scores);

        // Fetch all responses for the assignment
        const assignmentResponses = await AssignmentResponse.find({ assignment_id: assignmentId });

        // Fetch all questions for the assignment
        const assignmentQuestions = await AssignmentQuestion.find({ assignment_id: assignmentId });

        // Identify common mistakes
        const commonMistakes = [];
        assignmentResponses.forEach(response => {
            const question = assignmentQuestions.find(q => q.question_id === response.question_id);
            if (question && response.response !== question.correct_answer) {
                commonMistakes.push(`Incorrect answer for question ${response.question_id}`);
            }
        });

        // Calculate difficulty-wise statistics
        const difficultyStats = {
            easy: { totalQuestions: 0, correctAnswers: 0, averageScore: 0 },
            medium: { totalQuestions: 0, correctAnswers: 0, averageScore: 0 },
            hard: { totalQuestions: 0, correctAnswers: 0, averageScore: 0 }
        };

        assignmentQuestions.forEach(question => {
            const difficulty = question.tag.toLowerCase(); // Ensure case-insensitive matching
            if (difficultyStats[difficulty]) {
                difficultyStats[difficulty].totalQuestions += 1;

                // Calculate correct answers for this question
                const correctResponses = assignmentResponses.filter(
                    response => response.question_id === question.question_id && response.response === question.correct_answer
                ).length;

                difficultyStats[difficulty].correctAnswers += correctResponses;
            }
        });

        // Calculate average scores for each difficulty level
        Object.keys(difficultyStats).forEach(difficulty => {
            if (difficultyStats[difficulty].totalQuestions > 0) {
                difficultyStats[difficulty].averageScore =
                    (difficultyStats[difficulty].correctAnswers / difficultyStats[difficulty].totalQuestions) * 100;
            }
        });

        // Save the summary report to the database
        const summaryReport = new Summary({
            assignmentId,
            totalStudents,
            averageScore,
            highestScore,
            lowestScore,
            commonMistakes,
            difficultyStats
        });
        await summaryReport.save();

        return summaryReport;
    } catch (error) {
        console.error('Error generating summary report:', error.message);
        throw error;
    }
};

module.exports = { generateSummaryReport };