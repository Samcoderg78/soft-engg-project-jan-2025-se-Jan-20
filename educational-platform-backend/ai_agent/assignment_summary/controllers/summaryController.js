// assignmentSummaryController.js
const assignmentSummaryService = require('../services/summaryService');

class AssignmentSummaryController {
  async getAssignmentSummary(req, res) {
    try {
      const assignmentId = req.params.assignmentId;
      const summary = await assignmentSummaryService.getAssignmentSummary(assignmentId);
      res.json(summary);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new AssignmentSummaryController();