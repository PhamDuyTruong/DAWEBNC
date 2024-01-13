import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import gradeReviewApi from "../../Services/gradeReviewApi";
import classroomApi from "../../Services/classroomApi";
import { Divider, message } from "antd";
import CommentSection from "./Components/CommentSection";
import { Button } from "antd";

function DetailGradeReview() {
  const { classId, id } = useParams();

  const [review, setReview] = useState({});
  const [student, setStudent] = useState({});

  useEffect(() => {
    getGradeReviewById();
  }, []);

  const getGradeReviewById = async () => {
    try {
      const response = await gradeReviewApi.getGradeReviewById(id);
      const data = response.data;
      setReview(data);
      getStudentInfo(data.studentId);
    } catch (error) {
      console.log(error);
    }
  };

  const getStudentInfo = async (studentId) => {
    try {
      const response = await classroomApi.getStudentInfo(classId, studentId);
      const data = response.data;
      setStudent(data);
    } catch (error) {
      console.log(error);
    }
  };

  const updateStatus = async (status) => {
    try {
      const response = await gradeReviewApi.updateGradeReviewStatus(id, status);
      // Mark the grade as finalized
      if (status === "approved") {
        try {
          await classroomApi.markGradeFinalized(
            classId,
            review.studentId,
            review.assignmentId,
            review.grade
          );

          message.success("Grade finalized");
        } catch (error) {
          message.error(error.message);
        }
      }
      setReview(response.data);
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <h3>Grade Review Details</h3>

      <div className="w-[80%]">
        <div className="flex justify-between items-center gap-24">
          <div className="flex items-center gap-3">
            <img
              src={student.profilePic || "https://i.imgur.com/HeIi0wU.png"}
              alt="avatar"
              className="w-8 h-8 object-contain rounded-full"
            />
            <div className="text-[24px] leading-4">{student.fullname}</div>
          </div>
          <div className="text-xl font-semibold">
            Expected Grade:{" "}
            <span className=" text-blue-500">{review.grade}</span>
          </div>
        </div>
        <Divider className=" bg-blue-400" />
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-[1.5]">
            <p>
              <span className="text-lg font-bold">Grade Composition:</span>{" "}
              {review.gradeComposition || "None"}
            </p>
            <p>
              <span className="text-lg font-bold">Current grade:</span>{" "}
              {review.currentGrade}
            </p>
            <p>
              <span className="text-lg font-bold">Expected grade:</span>{" "}
              {review.grade}
            </p>
            <p>
              <span className="text-lg font-bold">Comment:</span>{" "}
              {review.comment}
            </p>
          </div>

          <div className="flex-1">
            <h3 className="">Status</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 rounded-full ${
                    review.status === "approved"
                      ? "bg-green-500"
                      : review.status === "rejected"
                      ? "bg-red-500"
                      : "bg-blue-500"
                  }`}
                ></div>
                <span className="text-lg">{review.status?.toUpperCase()}</span>
              </div>

              {review.status === "pending" && (
                <div className="flex gap-2">
                  <Button
                    type="primary"
                    onClick={() => updateStatus("approved")}
                  >
                    Approve
                  </Button>
                  <Button
                    type="primary"
                    danger
                    onClick={() => updateStatus("rejected")}
                  >
                    Reject
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <CommentSection review={review} setReview={setReview} />
    </div>
  );
}

export default DetailGradeReview;
