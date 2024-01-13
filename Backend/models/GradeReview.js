const mongoose = require("mongoose");

const gradeReviewSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
    },
    classroomId: {
      type: mongoose.Schema.ObjectId,
      ref: "ClassRoom",
    },
    assignmentId: {
      type: mongoose.Schema.ObjectId,
      ref: "Assignment",
    },
    grade: {
      type: Number,
    },
    comment: {
      type: String,
    },
    gradeComposition: {
      type: String,
    },
    currentGrade: {
      type: Number,
    },
    date: {
      type: Date,
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
    feedback: [
      {
        userId: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
        },
        content: {
          type: String,
        },
        date: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("GradeReview", gradeReviewSchema);
