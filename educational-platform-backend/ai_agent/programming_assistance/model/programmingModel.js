// programming-assistance/models/programmingModel.js
const mongoose = require('mongoose');

const programmingSchema = new mongoose.Schema({
    userQuery: { type: String, required: true }, // Student's query or code snippet
    response: { type: String, required: true }, // AI's response or feedback
    context: { type: String }, // Context of the query (e.g., assignment topic)
    resourceType: { type: String }, // Type of resource recommended (e.g., "Documentation", "Tutorial")
    resourceUrl: { type: String }, // URL of the recommended resource
    resourceDescription: { type: String }, // Description of the resource
    createdAt: { type: Date, default: Date.now } // Timestamp
});

module.exports = mongoose.model('Programming', programmingSchema);