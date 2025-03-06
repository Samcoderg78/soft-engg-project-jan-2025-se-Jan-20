const { Assignment, ProgAssignment } = require("../model/gd"); 


exports.getDeadlines = async (req, res) => {
    try {
        const { course_id } = req.query;

        const assignmentQuery = {};  
        const progAssignmentQuery = {}; 

        if (course_id) {
            assignmentQuery.course_id = course_id.trim();
            progAssignmentQuery.course_id = course_id.trim();
        }

        console.log("Assignment Query:", assignmentQuery);

        const assignments = await Assignment.find(assignmentQuery).sort({ due_date: 1 });
        const progAssignments = await ProgAssignment.find(progAssignmentQuery).sort({ due_date: 1 });

        return res.status(200).json({ assignments, progAssignments });
    } catch (error) {
        console.error("Error fetching deadlines:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
