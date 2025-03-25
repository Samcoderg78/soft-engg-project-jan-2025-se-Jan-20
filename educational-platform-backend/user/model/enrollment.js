const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  enrolled_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // This will add createdAt and updatedAt fields
});

// Create a compound index to prevent duplicate enrollments
enrollmentSchema.index({ user_id: 1, course_id: 1 }, { unique: true });

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

module.exports = Enrollment;