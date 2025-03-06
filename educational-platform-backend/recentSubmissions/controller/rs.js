const { AssignmentResponse, ProgAssignmentResponse } = require("../model/rs"); 

exports.getRecentSubmissions = async (req, res) => {
    try {
        const user_id = req.params.user_id || req.query.user_id;  // ✅ Accept both path & query params

        if (!user_id) {
            console.error("User ID is missing from the request.");
            return res.status(400).json({ message: "User ID is required" });
        }

        console.log("Fetching submissions for user_id:", user_id);

        const assignmentSubmissions = await AssignmentResponse.find({ user_id })
            .sort({ submitted_on: -1 })
            .limit(10);

        const progAssignmentSubmissions = await ProgAssignmentResponse.find({ user_id })
            .sort({ submitted_on: -1 })
            .limit(10);

        return res.status(200).json({ assignmentSubmissions, progAssignmentSubmissions });
    } catch (error) {
        console.error("Error fetching submissions:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
