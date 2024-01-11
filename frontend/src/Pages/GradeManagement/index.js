import React, { useState, useEffect, useRef } from "react";
import handleDownload from "../../utils/handleDownload";
import classroomApi from "../../Services/classroomApi";
import { DownloadOutlined } from "@ant-design/icons";
import { Button, Input, Typography, message } from "antd";
import GradeBoard from "./Components/GradeBoard";

const { Text } = Typography;

const GradeManagement = ({ classId }) => {
  const [classroom, setClassroom] = useState({});
  const file = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getClassroomById();
  }, []);

  const getClassroomById = async () => {
    try {
      const response = await classroomApi.getClassroomById(classId);
      const classroom = response.data;
      setClassroom(classroom);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTempletaDownload = () => {
    const headers = ["studentId", "fullname"];
    const data = classroom.students.map((student) => {
      return [student.studentId, student.fullname];
    });
    data.unshift(headers);

    const fileName = "template.xlsx";

    handleDownload(data, fileName);
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();
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

  return (
    <div>
      <div className="flex items-center">
        <div className="flex-1 flex gap-2 flex-col">
          <Text className="text-xl">Download</Text>
          <Button
            type="primary"
            className="w-52 flex items-center justify-center"
            onClick={handleTempletaDownload}
            icon={<DownloadOutlined />}
          >
            Student Template
          </Button>
        </div>
        <div className="flex flex-1 gap-2 flex-col">
          <Text className="text-xl">Upload</Text>
          <div className="flex items-center gap-2">
            <Input
              type="file"
              className="w-fit h-full"
              accept=".xlsx, .csv"
              onChange={(event) => (file.current = event.target.files[0])}
            />
            <Button loading={loading} onClick={handleFileUpload} type="primary">
              Submit
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-3">
        <GradeBoard classroom={classroom} setClassroom={setClassroom} />
      </div>
    </div>
  );
};

export default GradeManagement;
