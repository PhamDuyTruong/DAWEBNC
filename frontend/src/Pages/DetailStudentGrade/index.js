import React, { useState, useEffect, useRef } from "react";
import classroomApi from "../../Services/classroomApi";
import { Form, Modal, Divider, message, Button } from "antd";
import { useParams } from "react-router-dom";
import assignmentApi from "../../Services/assignmentApi";
import GradeReview from "./Components/GradeReview";
import gradeReviewApi from "../../Services/gradeReviewApi";
import { createNotification } from "../../Actions/NotificationAction";
import { useDispatch } from "react-redux";

function DetailStudentGrade() {
  const [overallGrade, setOverallGrade] = useState(0);
  const grades = useRef([]);
  const [studentInfo, setStudentInfo] = useState({});
  const [assignments, setAssignments] = useState([]);
  const [classroom, setClassroom] = useState({});

  const userInfo = JSON.parse(localStorage.getItem("user"));
  const { studentId, classId } = useParams();

  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const handleReviewRequest = async (currentGrade, assignment) => {
    // TODO: Send the review request to the server
    try {
      const grade = form.getFieldValue("grade");
      const comment = form.getFieldValue("comment");

      const newReviewRequest = {
        grade,
        comment,
        currentGrade,
        gradeComposition: assignment.gradeComposition,
      };

      await gradeReviewApi.createGradeReview(
        studentId,
        classId,
        assignment._id,
        newReviewRequest
      );

      message.success("Review request sent successfully");

      console.log(classroom);

      dispatch(
        createNotification({
          image: userInfo.profilePic,
          senderId: userInfo._id,
          receiverId: classroom.teachers?.map((teacher) => teacher.accountId),
          type: "grade",
          message: `Student ${userInfo.username} has requested a review for assignment ${assignment.title}`,
          detailPage: `/classroom/${classId}/grade-review/${assignment._id}`,
        })
      );
    } catch (error) {
      message.error(error.message);
    }

    // Close the modal and reset the form
    setModalVisible(false);
    form.resetFields();
  };

  const showModal = () => {
    setModalVisible(true);
  };

  const getAssignmentByClass = async () => {
    if (!classId) return;

    try {
      const response = await assignmentApi.getAssignmentByClass(classId);
      const data = response.data;
      setAssignments(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getOverallGrade = () => {
    let sum = 0;
    let totalMaxGrade = 0;

    if (!grades.current.length) return 0;

    for (let i = 0; i < grades.current.length; i++) {
      sum += grades.current[i].grade;

      totalMaxGrade += assignments[i]?.maxPoint || 0;
    }

    const overall = totalMaxGrade ? (sum / totalMaxGrade) * 100 : 0;
    setOverallGrade(overall.toFixed(2));
  };

  const getStudentInfo = async () => {
    try {
      const response = await classroomApi.getStudentInfo(classId, studentId);
      const student = response.data;
      grades.current = student.grades;
      if (student.studentId !== studentId)
        return message.error(
          "You are not allowed to view this student's grade"
        );
      setStudentInfo(student);
    } catch (error) {
      message.error(error.message);
    }
  };

  const getClassroom = async () => {
    try {
      const response = await classroomApi.getClassroomById(classId);
      const classroom = response.data;
      setClassroom(classroom);
    } catch (error) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    getClassroom();
    getStudentInfo();
    getAssignmentByClass();
  }, []);

  useEffect(() => {
    getOverallGrade();
  }, [studentInfo]);

  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-[50%]">
        <div className="flex justify-between items-center gap-24">
          <div className="flex items-center gap-3">
            <img
              src={studentInfo.profilePic || "https://i.imgur.com/HeIi0wU.png"}
              alt="avatar"
              className="w-8 h-8 object-contain rounded-full"
            />
            <div className="text-[24px] leading-4">{studentInfo.fullname}</div>
          </div>
          <div className="text-xl font-semibold">
            Overall Grade:{" "}
            <span className=" text-blue-500">{overallGrade}%</span>
          </div>
        </div>
        <Divider className=" bg-blue-400" />

        <ul className="flex flex-col gap-3">
          {studentInfo?.grades?.map((grade, index) => (
            <li
              key={index}
              className="flex items-center justify-between border px-4 py-2 rounded-md"
            >
              <div className="flex flex-col gap-1">
                <h4>{assignments[index]?.title}</h4>
                <span className="text-xs text-gray-400">
                  {assignments[index]?.gradeComposition ||
                    "No grade composition"}
                </span>
              </div>
              <div className="text-gray-900 font-semibold">
                {grade.grade} / {assignments[index]?.maxPoint}
              </div>
              <Button type="primary" onClick={() => showModal()}>
                Request Review
              </Button>
              <Modal
                title="Request Review"
                open={modalVisible}
                onOk={() =>
                  handleReviewRequest(grade.grade, assignments[index])
                }
                onCancel={() => setModalVisible(false)}
              >
                <GradeReview
                  form={form}
                  maxPoint={assignments[index]?.maxPoint}
                />
              </Modal>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default DetailStudentGrade;
