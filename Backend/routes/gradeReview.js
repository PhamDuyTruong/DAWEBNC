const gradeReviewController = require("../controllers/gradeReviewController");

const router = require("express").Router();

router.post(
  "/student/:studentId/classroom/:classroomId/assignment/:assignmentId",
  gradeReviewController.createGradeReview
);


router.get("/classroom/:classroomId", gradeReviewController.getGradeReviewByClassRoom);

router.get("/:id", gradeReviewController.getGradeReviewById);

router.get("/classroom/:classroomId/student/:studentId", gradeReviewController.getGradeViewByClassRoomAndStudentId);

router.post("/:id/comment", gradeReviewController.createComment);

router.put("/:id/status", gradeReviewController.updateGradeReviewStatus);

module.exports = router;
