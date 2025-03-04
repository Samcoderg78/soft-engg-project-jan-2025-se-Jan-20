const mongoose = require('mongoose');

const aiAgentSchema = new mongoose.Schema({
    userQuery: { type: String, required: true },
    response: { type: String, required: true },
    videoContext: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AIAgent', aiAgentSchema);