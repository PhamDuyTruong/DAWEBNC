import React, { useState, useEffect } from "react";
import { Table, InputNumber, Space } from "antd";
import assignmentApi from "../../../Services/assignmentApi";

const GradeBoard = ({ classroom, setClassroom }) => {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    getAssignmentByClass();
  }, [classroom]);

  const getAssignmentByClass = async () => {
    try {
      const response = await assignmentApi.getAssignmentByClass(classroom._id);
      const data = response.data;
      setAssignments(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGradeChange = (studentId, assignmentId, newGrade) => {
    // Replace this with a call to your API to update the grade
    fetch(`/api/students/${studentId}/assignments/${assignmentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ grade: newGrade }),
    })
      .then(() => console.log("Grade updated successfully"))
      .catch((err) => console.error(err));
  };

  const columns = [
    {
      title: "Student ID",
      dataIndex: "studentId",
      key: "studentId",
    },
    {
      title: "Full Name",
      dataIndex: "fullname",
      key: "fullname",
      render: (text, record) => (
        <div className="flex items-center gap-2">
          <img
            src={
              record.avatar ? record.avatar : "https://i.imgur.com/HeIi0wU.png"
            }
            alt="avatar"
            style={{ width: "30px", height: "30px", borderRadius: "50%" }}
          />
          <span
            className="hover:cursor-pointer hover:underline hover:text-blue-400"
            onClick={() =>
              (window.location.href = `/classroom/${classroom._id}/students/${record.studentId}`)
            }
          >
            {record.fullname}
          </span>
        </div>
      ),
    },
    ...assignments.map((assignment) => ({
      title: assignment.title,
      dataIndex: assignment._id,
      key: assignment._id,
      render: (text, record) => (
        <InputNumber
          min={0}
          max={100}
          defaultValue={text}
          onChange={(newGrade) =>
            handleGradeChange(record.studentId, assignment._id, newGrade)
          }
        />
      ),
    })),
  ];

  return <Table dataSource={classroom.students} columns={columns} />;
};

export default GradeBoard;
