const express = require("express");
const router = express.Router();
const difficultQuestionController = require("../controller/difficultQuestion");

router.post("/markasdifficult", difficultQuestionController.markAsDifficult);
router.get("/:user_id/:course_id", difficultQuestionController.getDifficult);

module.exports = router;