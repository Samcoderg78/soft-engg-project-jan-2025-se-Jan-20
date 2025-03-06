const express = require("express");
const router = express.Router();
const { getDeadlines } = require("../controller/gd");

// fetch all deadlines or for a specific course_id by using 
// /deadlines?course_id="....."
router.get("/deadlines", getDeadlines);

module.exports = router;
