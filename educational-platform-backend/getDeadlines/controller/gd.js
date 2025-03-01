const { Assignment, ProgAssignment } = require("../model/gd"); 

const mongoose = require("mongoose");

exports.getDeadlines = async (req, res) => {
    try {
        const { course_id } = req.query;

        const startOfToday = new Date();
        startOfToday.setUTCHours(0, 0, 0, 0);

        const assignmentQuery = { due_date: { $gte: startOfToday } };
        const progAssignmentQuery = { due_date: { $gte: startOfToday } };

        if (course_id) {
            assignmentQuery.course_id = course_id.trim();
            progAssignmentQuery.course_id = course_id.trim();
        }

        const assignments = await Assignment.find(assignmentQuery).sort({ due_date: 1 });
        const progAssignments = await ProgAssignment.find(progAssignmentQuery).sort({ due_date: 1 });

        return res.status(200).json({ assignments, progAssignments });
    } catch (error) {
        console.error("Error fetching deadlines:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
