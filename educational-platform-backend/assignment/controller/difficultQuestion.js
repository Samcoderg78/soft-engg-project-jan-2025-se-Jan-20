const DifficultQuestion = require("../model/difficultQuestion");
const Assignment = require("../model/assignment");

// Mark a question as difficult
exports.markAsDifficult = async (req, res) => {
    try {
      const { user_id, assignment_id, question } = req.body;
  
      const existingEntry = await DifficultQuestion.findOne({ user_id, assignment_id, question });
  
      if (existingEntry) {
        return res.status(200).json({ message: "Question is already marked as difficult" });
      }
  
      const newDifficultQuestion = new DifficultQuestion({
        user_id,
        assignment_id,
        question,
        marked_on: new Date(),
      });
  
      await newDifficultQuestion.save();
  
      res.status(201).json({ message: "Question marked as difficult", difficultQuestion: newDifficultQuestion });
    } catch (error) {
      res.status(500).json({ message: "Error marking question as difficult", error });
    }
  };
  
  // Get all difficult questions for a user in a specific course
  exports.getDifficult = async (req, res) => {
    try {
      const { user_id, course_id } = req.params;
  
      const assignments = await Assignment.find({ course_id }).select("_id");
      const assignmentIds = assignments.map(a => a._id);
  
      const difficultQuestions = await DifficultQuestion.find({
        user_id,
        assignment_id: { $in: assignmentIds },
      }).populate("question");
  
      if (!difficultQuestions.length) {
        return res.status(404).json({ message: "No difficult questions found for this course" });
      }
  
      res.status(200).json(difficultQuestions);
    } catch (error) {
      res.status(500).json({ message: "Error fetching difficult questions", error });
    }
  };

  // Remove a question from difficult questions
exports.removeDifficultQuestion = async (req, res) => {
  try {
      const { user_id, question_id } = req.params;

      const deletedQuestion = await DifficultQuestion.findOneAndDelete({ user_id, question: question_id });

      if (!deletedQuestion) {
          return res.status(404).json({ message: "Difficult question not found" });
      }

      res.status(200).json({ message: "Question removed from difficult list", deletedQuestion });
  } catch (error) {
      res.status(500).json({ message: "Error removing difficult question", error });
  }
};