// assignmentSummaryService.js
const Assignment = require('../../../assignment/model/assignment');
const AssignmentQuestion = require('../../../assignment/model/assignmentQuestion');
const AssignmentResponse = require('../../../assignment/model/assignmentResponse');
const AssignmentScore = require('../../../assignment/model/assignmentScore');

class AssignmentSummaryService {
  async getAssignmentSummary(assignmentId) {
    // Fetch the assignment details
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      throw new Error('Assignment not found');
    }

    // Fetch all questions for the assignment
    const questions = await AssignmentQuestion.find({ assignment_id: assignmentId });

    // Fetch all responses for the assignment
    const responses = await AssignmentResponse.find({ assignment_id: assignmentId });

    // Fetch all scores for the assignment
    const scores = await AssignmentScore.find({ response_id: { $in: responses.map(r => r._id) } });

    // Calculate total number of students who attempted the assignment
    const totalStudents = responses.length;

    // Calculate average score
    const totalScore = scores.reduce((sum, score) => sum + score.total_score, 0);
    const averageScore = totalStudents > 0 ? totalScore / totalStudents : 0;

    // Calculate score distribution
    const scoreDistribution = {
      '0-20': 0,
      '21-40': 0,
      '41-60': 0,
      '61-80': 0,
      '81-100': 0,
    };

    scores.forEach(score => {
      if (score.total_score <= 20) {
        scoreDistribution['0-20']++;
      } else if (score.total_score <= 40) {
        scoreDistribution['21-40']++;
      } else if (score.total_score <= 60) {
        scoreDistribution['41-60']++;
      } else if (score.total_score <= 80) {
        scoreDistribution['61-80']++;
      } else {
        scoreDistribution['81-100']++;
      }
    });

    // Calculate performance per question
    const questionPerformance = questions.map(question => {
      const questionScores = scores.flatMap(score => score.scores.filter(s => s.question_id === question._id.toString()));
      const totalMarks = questionScores.reduce((sum, s) => sum + s.score, 0);
      const averageMarks = questionScores.length > 0 ? totalMarks / questionScores.length : 0;
      return {
        question_id: question._id,
        question: question.question,
        average_marks: averageMarks,
      };
    });

    // Prepare the summary report
    return {
      assignment_id: assignment._id,
      title: assignment.title,
      total_students: totalStudents,
      average_score: averageScore,
      score_distribution: scoreDistribution,
      question_performance: questionPerformance,
    };
  }
}

module.exports = new AssignmentSummaryService();