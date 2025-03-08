// const mongoose = require('mongoose');

// const aiAgentSchema = new mongoose.Schema({
//     userQuery: { type: String, required: true },
//     response: { type: String, required: true },
//     videoContext: { type: String, default: 'General' },
//     embedding: { type: [Number] }, // Vector embeddings - now optional
//     resourceType: { type: String, default: 'General' },
//     resourceUrl: { type: String, default: '' },
//     resourceDescription: { type: String, default: '' },
//     assignmentType: { type: String, default: 'General' },
//     createdAt: { type: Date, default: Date.now }
// });

// // Create regular indexes for simple text search
// aiAgentSchema.index({ userQuery: 1 });
// aiAgentSchema.index({ response: 1 });
// aiAgentSchema.index({ createdAt: -1 });

// module.exports = mongoose.model('AIAgent', aiAgentSchema);

const mongoose = require('mongoose');

const aiAgentSchema = new mongoose.Schema({
    userQuery: { type: String, required: true },
    response: { type: String, required: true },
    videoContext: { type: String, default: 'General' },
    embedding: { type: [Number] }, // Vector embeddings for semantic search
    createdAt: { type: Date, default: Date.now }
});

// Index for faster retrieval
aiAgentSchema.index({ userQuery: 1 });
aiAgentSchema.index({ embedding: 1 });

module.exports = mongoose.model('AIAgent', aiAgentSchema);