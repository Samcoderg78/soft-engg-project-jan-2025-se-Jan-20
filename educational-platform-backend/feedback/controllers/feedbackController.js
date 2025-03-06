const Feedback = require("../models/feedbackModel");

// ✅ POST: Submit feedback
exports.postFeedback = async (req, res) => {
  try {
    const { user_id, course_id, feedback_string, rating } = req.body;

    if (!user_id || !course_id || !feedback_string || rating === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const feedback = new Feedback({ user_id, course_id, feedback_string, rating });
    await feedback.save();

    res.status(201).json({ message: "Feedback submitted successfully", feedback });
  } catch (error) {
    res.status(500).json({ message: "Error submitting feedback", error: error.message });
  }
};

// ✅ GET: Get feedback for a specific course
exports.getFeedback = async (req, res) => {
  try {
    const { course_id } = req.params;

    const feedbacks = await Feedback.find({ course_id });
    if (feedbacks.length === 0) {
      return res.status(404).json({ message: "No feedback found for this course" });
    }

    res.status(200).json({ feedbacks });
  } catch (error) {
    res.status(500).json({ message: "Error fetching feedback", error: error.message });
  }
};