const GradeReview = require("../models/GradeReview");

const gradeReviewController = {
  createGradeReview: async (req, res) => {
    const { studentId, classroomId, assignmentId } = req.params;

    try {
      const newGradeReview = new GradeReview({
        studentId,
        classroomId,
        assignmentId,
        date: Date.now(),
        ...req.body,
      });

      await newGradeReview.save();
      res.status(201).json(newGradeReview);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getGradeReviewByClassRoom: async (req, res) => {
    const { classroomId } = req.params;

    try {
      const gradeReviews = await GradeReview.find({ classroomId });
      gradeReviews.sort((n1, n2) => {
        return new Date(n2.createdAt) - new Date(n1.createdAt);
      });

      res.status(200).json(gradeReviews);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getGradeReviewById: async (req, res) => {
    const { id } = req.params;

    try {
      const gradeReview = await GradeReview.findById(id)
        .populate("assignmentId")
        .populate("feedback.userId");

      res.status(200).json(gradeReview);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getGradeViewByClassRoomAndStudentId: async (req, res) => {
    const { classroomId, studentId } = req.params;

    try {
      const gradeReviews = await GradeReview.find({
        classroomId,
        studentId,
      }).populate("feedback.userId");
      res.status(200).json(gradeReviews);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  createComment: async (req, res) => {
    const { id } = req.params;
    const { userId, content } = req.body;

    try {
      const gradeReview = await GradeReview.findById(id);
      gradeReview.feedback.push({ userId, content, date: new Date() });
      await gradeReview.save();
      res.status(200).json(gradeReview);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  updateGradeReviewStatus: async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
      const gradeReview = await GradeReview.findById(id);
      gradeReview.status = status;
      await gradeReview.save();
      res.status(200).json(gradeReview);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = gradeReviewController;
