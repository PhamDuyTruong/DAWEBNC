import React, { useState, useEffect, useRef } from "react";
import { Divider, message } from "antd";
import { useParams } from "react-router-dom";
import classroomApi from "../../Services/classroomApi";
import assignmentApi from "../../Services/assignmentApi";
import AccountNav from "./AccountNav";

function AccountGrade() {
  const userInfo = JSON.parse(localStorage.getItem("user"));
  const [classrooms, setClassrooms] = useState([]);

  useEffect(() => {
    getAllJoinedClass();
  }, []);

  const getAllJoinedClass = async () => {
    try {
      const response = await classroomApi.getAllJoinedClass(userInfo._id);
      const data = response.data;
      setClassrooms(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mb-4">
      <AccountNav />
      <p className="text-[30px] font-semibold text-[#F2BE22] text-center">
        My Grades
      </p>
      <div className="w-full flex justify-center items-center">
        <div className="w-[50%]">
          <div className="flex justify-between items-center gap-24">
            <div className="flex items-center gap-3">
              <img
                src={userInfo.profilePic || "https://i.imgur.com/HeIi0wU.png"}
                alt="avatar"
                className="w-8 h-8 object-contain rounded-full"
              />
              <div className="text-[24px] leading-4">{userInfo.username}</div>
            </div>
          </div>
          <Divider className=" bg-blue-400" />
          <div className="flex flex-col items-center">
            <h3>All Your Joined Classroom</h3>
            <p className="text-sm text-gray-400">
              Click one to view your own detail grade with your student ID.
            </p>
          </div>

          <ul className="flex flex-wrap gap-3">
            {classrooms?.map((classroom, index) => (
              <li
                key={index}
                className="flex items-center justify-between border px-4 py-2 rounded-md cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  window.location.href = `/classroom/${classroom._id}/student/${userInfo.studentId}`;
                }}
              >
                <div className="flex flex-col gap-1">
                  <h4>{classroom.name}</h4>
                  <span className="text-xs text-gray-400">
                    {classroom.description}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AccountGrade;
