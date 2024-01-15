import { CheckOutlined, EllipsisOutlined } from "@ant-design/icons";
import { Dropdown, InputNumber, Table, Typography, message } from "antd";
import React, { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { createNotification } from "../../../Actions/NotificationAction";
import logo from "../../../Assets/images/Logo.jpg";
import assignmentApi from "../../../Services/assignmentApi";
import classrommApi from "../../../Services/classroomApi";

const GradeBoard = ({
  classroom,
  assignments,
  setClassroom,
  setAssignments,
}) => {
  const [grade, setGrade] = useState(0);
  const [editingRecord, setEditingRecord] = useState({});
  const [editingAssignment, setEditingAssignment] = useState({});
  const [loadingGrade, setLoadingGrade] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem("user"));
  const dispatch = useDispatch();

  const menuProps = (record, assignment, grade, isFinal) => {
    const items = [
      {
        label: "Mark as finalized",
        key: "0",
        icon: <CheckOutlined />,
        onClick: () => {
          handleFinalGradeMarked(record, assignment, grade);
        },
        disabled: isFinal,
      },
    ];

    return {
      items,
    };
  };

  const getAssignmentByClass = async () => {
    const classroomId = classroom._id;
    if (!classroomId) return;

    try {
      const response = await assignmentApi.getAssignmentByClass(classroomId);
      const data = response.data;
      setAssignments(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFinalGradeMarked = async (record, assignment, grade) => {
    setLoadingGrade(true);
    const { _id, title } = assignment;
    const { studentId, accountId } = record;
    const assignmentId = _id;

    try {
      const response = await classrommApi.markGradeFinalized(
        classroom._id,
        studentId,
        assignmentId,
        grade
      );
      setClassroom(response.data);
      getAssignmentByClass();

      // Create notification
      dispatch(
        createNotification({
          image: userInfo.profilePic,
          senderId: userInfo._id,
          receiverId: [accountId],
          type: "grade",
          message: `Your grade for assigment ${title} has been finalized`,
          detailPage: `/classroom/${classroom._id}/student/${studentId}`,
        })
      );
    } catch (error) {
      message.error(error.response.data.message);
    } finally {
      setLoadingGrade(false);
    }
  };

  const handleGradeChange = async (studentId, assignmentId) => {
    setLoadingGrade(true);
    try {
      const response = await classrommApi.updateGrade(
        classroom._id,
        studentId,
        assignmentId,
        grade
      );
      setClassroom(response.data);
      getAssignmentByClass();
    } catch (error) {
      message.error(error.response.data.message);
    } finally {
      setLoadingGrade(false);
    }
  };

  const columns = [
    {
      title: "Student ID",
      dataIndex: "studentId",
      key: "studentId",
      width: "10%",
    },
    {
      title: "Full Name",
      dataIndex: "fullname",
      width: "15%",
      key: "fullname",
      render: (text, record) => (
        <div className="flex items-center gap-2">
          <img
            src={
              record.profilePic
                ? record.profilePic
                : "https://i.imgur.com/HeIi0wU.png"
            }
            alt="avatar"
            style={{ width: "30px", height: "30px", borderRadius: "50%" }}
          />
          <span
            className="hover:cursor-pointer hover:underline hover:text-blue-400"
            onClick={() =>
              (window.location.href = `/classroom/${classroom._id}/student/${record.studentId}`)
            }
          >
            {record.fullname}
          </span>
        </div>
      ),
    },
    {
      title: "Total Grade",
      key: "totalGrade",
      render: (_, record) => {
        // total grade by weight (percent)
        console.log(record);
        // const totalGrade = record.grades.reduce(
        //   (sum, grade) => sum + (grade.grade || 0) * (grade.assignmentId?.gradeComposition?.weight / 100),
        //   0
        // );

        const gradeCompositionTotalGrade = {};
        const gradeCompositionTotalCount = {};

        record.grades.forEach((grade) => {
          const { assignmentId } = grade;
          const { gradeComposition } = assignmentId;

          if (!gradeComposition) return;

          if (!gradeCompositionTotalGrade[gradeComposition._id]) {
            gradeCompositionTotalGrade[gradeComposition._id] = 0;
            gradeCompositionTotalCount[gradeComposition._id] = 0;
          }
          gradeCompositionTotalGrade[gradeComposition._id] += grade.grade;
          gradeCompositionTotalCount[gradeComposition._id] += 1;
        });

        const totalGrade = Object.entries(gradeCompositionTotalGrade).reduce(
          (sum, [gradeCompositionId, grade]) => {
            const gradeComposition = classroom.gradeComposition.find(
              (gradeComposition) => gradeComposition._id == gradeCompositionId
            );
            return (
              sum +
              (grade / gradeCompositionTotalCount[gradeCompositionId]) *
                (gradeComposition.weight / 100)
            );
          },
          0
        );

        return <Typography.Text>{totalGrade.toFixed(2)}</Typography.Text>;
      },
    },
    ...assignments.map((assignment, index) => ({
      title: () => (
        <div className="flex flex-col gap-1">
          <span>{assignment.title}</span>
          <hr />
          <span className="text-xs text-gray-400">
            {assignment.gradeComposition?.name} / {assignment.maxPoint}{" "}
          </span>
        </div>
      ),
      dataIndex: assignment._id,
      key: assignment._id,
      render: (text, record) => {
        const { tempGrade, grade, isFinal } = record.grades[index] || {};

        const gradeCell = isFinal ? grade : tempGrade;

        return record.fullname !== "Total grade" ? (
          <div>
            <div className="flex flex-col gap-1">
              <InputNumber
                min={0}
                max={100}
                key={record._id}
                value={gradeCell}
                onChange={(newGrade) => {
                  setGrade(newGrade);
                  setEditingRecord(record);
                  setEditingAssignment(assignment);
                }}
                onBlur={() =>
                  handleGradeChange(record.studentId, assignment._id)
                }
              />

              <div className="text-xs text-gray-400">
                {record._id == editingRecord._id &&
                assignment._id == editingAssignment._id &&
                loadingGrade
                  ? "Loading..."
                  : isFinal
                  ? "Finalized"
                  : "Draft"}
              </div>
            </div>
            <Dropdown.Button
              menu={menuProps(record, assignment, tempGrade, isFinal)}
              trigger={["click"]}
              buttonsRender={([]) => [
                <div />,
                <div className="rotate-90 absolute top-3 right-2 cursor-pointer p-2 rounded-3xl hover:bg-zinc-400/30">
                  <EllipsisOutlined className="text-[24px] text-slate-600" />
                </div>,
              ]}
            />
          </div>
        ) : (
          <Typography.Text>{grade}</Typography.Text>
        );
      },
    })),
  ];

  //   const totalGrade = useMemo(() => {
  //     const totalGrade = classroom?.students?.reduce((sum, student) => {
  //       const studentTotalGrade = student.grades.reduce(
  //         (sum, studentGrade) => sum + (studentGrade?.grade || 0),
  //         0
  //       );
  //       return sum + studentTotalGrade;
  //     }, 0);
  //     return totalGrade;
  //   }, [classroom]);

  const totalGradesByAssignment = useMemo(() => {
    const totalGrades = {};
    classroom?.students?.forEach((student) => {
      student.grades.forEach((grade) => {
        if (!totalGrades[grade.assignmentId._id]) {
          totalGrades[grade.assignmentId._id] = 0;
        }
        totalGrades[grade.assignmentId._id] += grade.grade || 0;
      });
    });

    return totalGrades;
  }, [classroom]);

  const studentsWithTotal = useMemo(() => {
    const total = {
      studentId: "",
      fullname: "Total grade",
      profilePic: logo,
      grades: Object.entries(totalGradesByAssignment).map(
        ([assignmentId, totalGrade]) => ({
          assignmentId,
          grade: totalGrade,
        })
      ),
    };

    const students = classroom?.students || [];
    return [total, ...students];
  }, [classroom]);

  return (
    <Table
      bordered
      rowKey={(record) => record.studentId}
      dataSource={studentsWithTotal}
      columns={columns}
    />
  );
};

export default GradeBoard;
