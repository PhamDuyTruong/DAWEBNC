import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";
import assignmentApi from "../../../Services/assignmentApi";
import { AssignmentIcon } from "./ExerciseIcon";
import Swal from "sweetalert2";

const Exercises = ({ isTeacher, classId }) => {
  const [assignments, setAsssignments] = useState([]);
  const history = useHistory();
  const user = JSON.parse(localStorage.getItem("user"));

  function handleClick() {
    localStorage.setItem("classId", classId);
    history.push(`/create-assignment`);
  }

  const handleGetAssignment = async () => {
    try {
      const response = await assignmentApi.getAssignmentByClass(classId);
      setAsssignments(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteAssignment = async (id) => {
    try {
      const response = await assignmentApi.deleteAssignment(id, classId);
      if (response) {
        console.log(response);
        Swal.fire({
          title: "Delete Assignment successfully!",
          text: "Great!",
          icon: "success",
        });
      }
      const currentAssignment = assignments.filter((item) => item.id !== id);
      setAsssignments(currentAssignment);
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Delete Assignment Failed!",
        text: "Oops!",
        icon: "error",
      });
    }
  };

  useEffect(() => {
    handleGetAssignment();
  }, []);

  return (
    <>
      {isTeacher() ? (
        <div
          className="border bg-sky-400 w-[200px] cursor-pointer text-white text-center p-2 rounded-full hover:bg-sky-600"
          onClick={handleClick}
        >
          + Create Asssignment
        </div>
      ) : (
        <div
          className="border w-[200px] cursor-pointer text-blue-500 hover:text-white text-center p-2 rounded-full hover:bg-sky-400"
          onClick={() => {
            history.push(`/classroom/${classId}/student/${user.studentId}`);
          }}
        >
          View All Assignment
        </div>
      )}
      {assignments.length > 0 &&
        assignments.map((item) => {
          return (
            <div
              key={item._id}
              className="bg-white my-5 border rounded-[12px] flex items-center justify-between p-4 cursor-pointer"
              onClick={() => history.push(`/assignment/${item._id}`)}
            >
              <div className="flex items-center justify-center gap-4">
                <div className="p-3 rounded-full bg-cyan-400 text-center">
                  <AssignmentIcon />
                </div>
                <p className="text-[22px] font-[500] text-[#3c4043] text-center pt-2">
                  {item.title}
                </p>
              </div>
              <div className="flex items-center justify-center gap-4">
                <p className="text-[15px] text-[#d5d5d5] mt-[20px]">
                  Posted: {item?.dueDate?.slice(0, 10)}
                </p>
                <div
                  className="pt-2"
                  onClick={() => handleDeleteAssignment(item._id)}
                >
                  <AiOutlineClose />
                </div>
              </div>
            </div>
          );
        })}
    </>
  );
};

export default Exercises;
