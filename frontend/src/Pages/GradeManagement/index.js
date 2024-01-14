import React, { useState, useEffect, useRef } from "react";
import handleDownload from "../../utils/handleDownload";
import classroomApi from "../../Services/classroomApi";
import { DownloadOutlined } from "@ant-design/icons";
import { Button, Input, Select, Typography, message } from "antd";
import GradeBoard from "./Components/GradeBoard";
import { exportFile } from "../../utils/handleExport";
import assignmentApi from "../../Services/assignmentApi";

const { Text } = Typography;

const GradeManagement = ({ classId }) => {
  const [classroom, setClassroom] = useState({});
  const [assignments, setAssignments] = useState([]);
  const [selectedDownloadAssignmentId, setSelectedDownloadAssignmentId] =
    useState(null);
  const [selectedUploadAssignmentId, setSelectedUploadAssignmentId] =
    useState(null);
  const file = useRef(null);
  const fileGrade = useRef(null);
  const [loading, setLoading] = useState(false);
  const [gradeLoading, setGradeLoading] = useState(false);

  useEffect(() => {
    getClassroomById();
  }, []);

  useEffect(() => {
    getAssignmentByClass();
  }, [classroom]);

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

  const getClassroomById = async () => {
    try {
      const response = await classroomApi.getClassroomById(classId);
      const classroom = response.data;
      setClassroom(classroom);
    } catch (error) {
      console.log(error);
    }
  };

  const handleStudentTemplateDownload = (fileType = ".csv") => {
    const headers = ["studentId", "fullname"];
    const data = classroom.students.map((student) => {
      return [student.studentId, student.fullname];
    });

    data.unshift(headers);

    const fileName = `student-template${fileType}`;

    handleDownload(data, fileName);
  };

  const handleGradeTemplateDownload = (fileType = ".csv") => {
    const headers = ["studentId", "grade"];
    const data = classroom.students.map((student) => {
      const studentGrade = student.grades.find(
        (grade) => grade.assignmentId == selectedDownloadAssignmentId
      );
      return [student.studentId, studentGrade?.grade];
    });
    data.unshift(headers);

    const fileName = `grade-template${fileType}`;

    handleDownload(data, fileName);
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();
    if (!file.current) return message.error("Please select a file");

    const formData = new FormData();
    formData.append("grade", file.current);
    setLoading(true);
    try {
      await classroomApi.uploadStudentList(classId, formData);
      // Refresh the classroom data after the upload
      getClassroomById();
      message.success("Upload successfully");
    } catch (error) {
      console.log(error);
      message.error("Upload failed");
    }
    setLoading(false);
  };

  const handleGradeUpload = async (event) => {
    event.preventDefault();
    if (!fileGrade.current) return message.error("Please select a file");

    const formData = new FormData();
    formData.append("assignmentGrade", fileGrade.current);
    setGradeLoading(true);
    try {
      await classroomApi.uploadAssignmentGrade(
        classId,
        selectedUploadAssignmentId,
        formData
      );
      // Refresh the assignments data after the upload
      getClassroomById();
      message.success("Upload successfully");
    } catch (error) {
      console.log(error);
      message.error("Upload failed");
    }
    setGradeLoading(false);
  };

  return (
    <div>
      <div className="w-full flex-col xl:flex-row flex items-center gap-4">
        <div className="flex-1 flex gap-2 items-center border rounded-md px-4 py-2 flex-col">
          <Text className="text-xl">Download Student Template</Text>
          <div className="flex items-center gap-2 md:flex-row flex-col">
            <Button
              className="flex items-center justify-center"
              onClick={() => handleStudentTemplateDownload()}
              icon={<DownloadOutlined />}
            >
              student-template.csv
            </Button>
            <Button
              type="primary"
              className="flex items-center justify-center"
              onClick={() => handleStudentTemplateDownload(".xlsx")}
              icon={<DownloadOutlined />}
            >
              student-template.xlsx
            </Button>
          </div>
        </div>
        <div className="flex-1 flex gap-2 items-center border rounded-md px-4 py-2 flex-col">
          <Text className="text-xl">Export Grade Board</Text>
          <div className="flex items-center gap-2 md:flex-row flex-col">
            <Button
              onClick={() => exportFile(classroom.students, assignments)}
              className="flex items-center justify-center"
              icon={<DownloadOutlined />}
            >
              CSV
            </Button>
            <Button
              onClick={() =>
                exportFile(classroom.students, assignments, ".xlsx")
              }
              type="primary"
              className="flex items-center justify-center"
              icon={<DownloadOutlined />}
            >
              XLSX
            </Button>
          </div>
        </div>
        <div className="flex-1 flex gap-2 items-center border rounded-md px-4 py-2 flex-col">
          <Text className="text-xl">Upload Student List</Text>
          <div className="flex items-center gap-2 md:flex-row flex-col">
            <Input
              type="file"
              className="w-fit h-full"
              accept=".xlsx, .csv"
              onChange={(event) => (file.current = event.target.files[0])}
            />
            <Button
              loading={loading}
              onClick={handleFileUpload}
              type="primary"
              disabled={file.current}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-4 w-full flex-col xl:flex-row flex items-center gap-4">
        <div className="flex-1 flex gap-2 items-center border rounded-md px-4 py-2 flex-col">
          <Text className="text-xl">Download Grade Template</Text>
          <Select
            className="w-full"
            placeholder="Select an assignment"
            onChange={(value) => setSelectedDownloadAssignmentId(value)}
          >
            {assignments.map((assignment) => (
              <Select.Option key={assignment._id} value={assignment._id}>
                {assignment.title}
              </Select.Option>
            ))}
          </Select>
          <div className="flex items-center gap-2 md:flex-row flex-col">
            <Button
              className="flex items-center justify-center"
              onClick={() => handleGradeTemplateDownload()}
              icon={<DownloadOutlined />}
              disabled={!selectedDownloadAssignmentId}
            >
              grade-template.csv
            </Button>
            <Button
              type="primary"
              className="flex items-center justify-center"
              onClick={() => handleGradeTemplateDownload(".xlsx")}
              icon={<DownloadOutlined />}
              disabled={!selectedDownloadAssignmentId}
            >
              grade-template.xlsx
            </Button>
          </div>
        </div>

        <div className="flex-1 flex gap-2 items-center border rounded-md px-4 py-2 flex-col">
          <Text className="text-xl">Upload Assignment Grade</Text>
          <Select
            className="w-full"
            placeholder="Select an assignment"
            onChange={(value) => setSelectedUploadAssignmentId(value)}
          >
            {assignments.map((assignment) => (
              <Select.Option key={assignment._id} value={assignment._id}>
                {assignment.title}
              </Select.Option>
            ))}
          </Select>
          <div className="flex items-center gap-2 md:flex-row flex-col">
            <Input
              type="file"
              className="w-fit h-full"
              accept=".xlsx, .csv"
              onChange={(event) => (fileGrade.current = event.target.files[0])}
              disabled={!selectedUploadAssignmentId}
            />
            <Button
              loading={gradeLoading}
              onClick={handleGradeUpload}
              type="primary"
              disabled={!selectedUploadAssignmentId}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-3">
        <GradeBoard
          classroom={classroom}
          setClassroom={setClassroom}
          assignments={assignments}
          setAssignments={setAssignments}
        />
      </div>
    </div>
  );
};

export default GradeManagement;
