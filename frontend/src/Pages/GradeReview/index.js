import React, { useState, useEffect } from "react";
import gradeReviewApi from "../../Services/gradeReviewApi";
import { Tag } from "antd";

const GradeReview = ({ isTeacher, classId }) => {
  const [reviewRequests, setReviewRequests] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (isTeacher()) {
      getGradeReviewByClassRoom();
    } else {
      getGradeViewByClassRoomAndStudentId(user.studentId);
    }
  }, []);

  const getGradeReviewByClassRoom = async () => {
    try {
      const response = await gradeReviewApi.getGradeReviewByClassRoom(classId);
      const data = response.data;
      setReviewRequests(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getGradeViewByClassRoomAndStudentId = async (studentId) => {
    try {
      const response = await gradeReviewApi.getGradeViewByClassRoomAndStudentId(
        classId,
        studentId
      );
      const data = response.data;
      setReviewRequests(data);
    } catch (error) {
      console.log(error);
    }
  };

  const checkStatus = (status) => {
    if (status === "rejected") return "red";
    else if (status === "approved") return "green";
    else return "blue";
  };

  return (
    <div>
      <div className="w-full flex-col xl:flex-row flex items-center gap-4">
        <ul className="w-full flex gap-4 flex-col">
          {reviewRequests.map((request, index) => (
            <li
              key={index}
              className="flex cursor-pointer items-center md:flex-col flex-row justify-between border px-4 py-2 gap-12 rounded-md"
              onClick={() => {
                window.location.href = `/classroom/${classId}/grade-review/${request._id}`;
              }}
            >
              <div>
                <div className="flex flex-1 items-center">
                  <Tag color={checkStatus(request.status)}>
                    {request.status.toString().toUpperCase()}
                  </Tag>
                  <div className="text-gray-900 font-semibold">
                    Student ID:{" "}
                    <span className="font-normal">{request.studentId}</span>
                  </div>
                </div>
                <div className="text-gray-900 font-semibold">
                  Expected: <span className="font-normal">{request.grade}</span>
                </div>
              </div>
              <div className=" text-gray-400">
                {request.date && Date(request.date).toString().slice(0, 21)}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GradeReview;
