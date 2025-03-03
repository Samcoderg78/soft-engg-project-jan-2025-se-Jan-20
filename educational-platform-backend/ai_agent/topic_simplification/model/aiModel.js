const mongoose = require('mongoose');

const aiKnowledgeBaseSchema = new mongoose.Schema({
    title: { type: String, required: true },       // Title of the topic (e.g., "Recursion")
    content: { type: String, required: true },     // Detailed content (e.g., "Recursion is when a function calls itself...")
    embedding: { type: [Number], required: true }, // Embedding vector for semantic search
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }, // Link to the course
    weekId: { type: mongoose.Schema.Types.ObjectId, ref: 'Week' },     // Link to the week
    lectureId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lecture' }, // Link to the lecture
}, { timestamps: true });

module.exports = mongoose.model('AIKnowledgeBase', aiKnowledgeBaseSchema);