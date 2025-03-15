const express = require("express");
const router = express.Router();
const difficultQuestionController = require("../controller/difficultQuestion");

router.post("/markasdifficult", difficultQuestionController.markAsDifficult);
router.get("/:user_id/:course_id", difficultQuestionController.getDifficult);
router.delete("/remove/:user_id/:question_id", difficultQuestionController.removeDifficultQuestion);

module.exports = router;