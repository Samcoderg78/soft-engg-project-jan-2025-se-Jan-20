// instructor-assistant/models/instructorModel.js
const mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema({
    query: { type: String, required: true }, // Instructor's query or topic
    response: { type: String, required: true }, // AI's response or supplementary content
    context: { type: String }, // Context of the query (e.g., course name)
    resourceType: { type: String }, // Type of resource (e.g., "Article", "Video")
    resourceUrl: { type: String }, // URL of the resource
    resourceDescription: { type: String }, // Description of the resource
    createdAt: { type: Date, default: Date.now } // Timestamp
});

module.exports = mongoose.model('Instructor', instructorSchema);