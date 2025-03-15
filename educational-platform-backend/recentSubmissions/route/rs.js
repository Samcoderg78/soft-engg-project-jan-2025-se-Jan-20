const express = require("express");
const router = express.Router();
const { getRecentSubmissions } = require("../controller/rs");

router.get("/recent_submissions/:user_id", getRecentSubmissions);

module.exports = router;
