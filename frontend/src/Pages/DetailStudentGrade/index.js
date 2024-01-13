import React, { useState, useEffect, useRef } from "react";
import classroomApi from "../../Services/classroomApi";
import { Divider, message } from "antd";
import { useParams } from "react-router-dom";
import assignmentApi from "../../Services/assignmentApi";

function DetailStudentGrade() {
  const [overallGrade, setOverallGrade] = useState(0);
  const grades = useRef([]);
  const [studentInfo, setStudentInfo] = useState({});
  const [assignments, setAssignments] = useState([]);

  const { studentId, classId } = useParams();

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
      if (grades.current[i].isFinal) {
        sum += grades.current[i].grade;
      }
      totalMaxGrade += assignments[i].maxPoint;
    }

    const overall = (sum / totalMaxGrade) * 100;
    setOverallGrade(overall.toFixed(2));
  };

  const getStudentInfo = async () => {
    try {
      const response = await classroomApi.getStudentInfo(classId, studentId);
      const student = response.data;
      grades.current = student.grades;
      setStudentInfo(student);
    } catch (error) {
      message.error(error.message);
    }
  };

  useEffect(() => {
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
                <h4>{assignments[index].title}</h4>
                <span className="text-xs text-gray-400">
                  {assignments[index].gradeComposition}
                </span>
              </div>
              <div className="text-gray-900 font-semibold">
                {grade.isFinal ? grade.grade : grade.tempGrade} /{" "}
                {assignments[index].maxPoint}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default DetailStudentGrade;
