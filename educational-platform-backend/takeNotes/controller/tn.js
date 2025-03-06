const Notes = require("../model/tn");
const mongoose = require("mongoose");

// ✅ Add a Note
exports.takeNote = async (req, res) => {
    try {
        const { user_id, lecture_id, course_id, note } = req.body;

        // Validate required fields
        if (!user_id || !lecture_id || !course_id || !note) {
            return res.status(400).json({ message: "User ID, Lecture ID, Course ID, and Note are required" });
        }

        // Debugging: Log received data
        console.log("Received data:", { user_id, lecture_id, course_id, note });

        // Create a new note document
        const newNote = new Notes({
            user_id,  // Store as string
            lecture_id,
            course_id,
            note,
            timestamp: new Date()
        });

        // Save the new note
        await newNote.save();

        return res.status(201).json({ message: "Note added successfully!", note: newNote });
    } catch (error) {
        console.error("Error taking notes:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};



// ✅ Fetch Notes for a Specific Lecture
exports.getNotesByLecture = async (req, res) => {
    try {
        const { lecture_id } = req.params;

        if (!lecture_id) {
            return res.status(400).json({ message: "Lecture ID is required" });
        }

        const notes = await Notes.find({ lecture_id }).sort({ timestamp: -1 });

        return res.status(200).json({ notes });
    } catch (error) {
        console.error("Error fetching notes:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// ✅ Fetch Notes for a Specific Course
exports.getNotesByCourse = async (req, res) => {
    try {
        const { course_id } = req.params;

        if (!course_id) {
            return res.status(400).json({ message: "Course ID is required" });
        }

        const notes = await Notes.find({ course_id }).sort({ timestamp: -1 });

        return res.status(200).json({ notes });
    } catch (error) {
        console.error("Error fetching notes:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// ✅ Fetch Notes for a Specific User
exports.getNotesByUser = async (req, res) => {
    try {
        const { user_id } = req.params;

        if (!user_id) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const notes = await Notes.find({ user_id }).sort({ timestamp: -1 });

        return res.status(200).json({ notes });
    } catch (error) {
        console.error("Error fetching notes:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
