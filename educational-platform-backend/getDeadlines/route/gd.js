const express = require("express");
const router = express.Router();
const { getDeadlines } = require("../controller/gd");

router.get("/deadlines", getDeadlines);

module.exports = router;
