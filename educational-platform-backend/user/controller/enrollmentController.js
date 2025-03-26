const Enrollment = require('../model/enrollment'); // Import Enrollment model
const mongoose = require('mongoose');

// Fetch only course IDs for a given user ID
const getCourseIdsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Fetch only course_id list
    const enrollments = await Enrollment.find({ user_id: userId })
      .select('course_id -_id'); // Select only course_id, exclude _id

    // Extract course IDs
    const courseIds = enrollments.map(enrollment => enrollment.course_id);

    if (!courseIds.length) {
      return res.status(404).json({ message: 'No enrollments found for this user' });
    }

    res.status(200).json(courseIds);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getCourseIdsByUserId };
