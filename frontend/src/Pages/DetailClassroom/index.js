import React, { useState, useLayoutEffect } from "react";
import { CameraIcon } from "../Classroom/Components/CameraIcon";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import classroomApi from "../../Services/classroomApi";
import { useParams, useHistory } from "react-router-dom";
import { message, Skeleton } from "antd";
import People from "./Components/People";
import Exercises from "./Components/Exercises";
import GradeStructure from "../GradeStructure";
import GradeManagement from "../GradeManagement";

const DEFAULT_IMAGE =
  "https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
const DetailClass = () => {
  const [value, setValue] = useState(0);
  const { id } = useParams();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [classroom, setClassroom] = useState({});

  useLayoutEffect(() => {
    if (!loading) {
      setLoading(true);
      classroomApi
        .checkUserJoinClass(id)
        .then((res) => {
          if (!res.data.joined) {
            message.error("You are not allowed to join this class");
            setTimeout(() => {
              history.push("/classroom");
            }, 1000);
          } else {
            console.log(res.data);
            setClassroom(res.data.classroom);
            setLoading(false);
          }
        })
        .then((err) => {
          console.log(err);
        });
    }
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const isTeacher = () => {
    const userInfo = JSON.parse(localStorage.getItem("user"));
    if (classroom.teachers) {
      const check = classroom.teachers.find(
        (teacher) => teacher.accountId == userInfo._id 
      );
      
      if (check) return true;
    }
    return false;
  };

  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  return (
    <>
      {loading ? (
        <Skeleton active />
      ) : (
        <div className="flex flex-col items-center px-[60px] mb-10">
          <div className="w-full relative">
            <img src={DEFAULT_IMAGE} className="w-full h-[450px]" />
            <div className="w-[50px] h-[50px] absolute right-0 top-[420px] rounded-full p-3 flex items-center justify-center border border-[#efefef] cursor-pointer hover:bg-[#ddd] hover:opacity-50">
              <CameraIcon />
            </div>
          </div>
          <Box sx={{ width: "100%", marginTop: "40px" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="News" {...a11yProps(0)} />
                <Tab label="Exercises" {...a11yProps(1)} />
                <Tab label="Grade Structure" {...a11yProps(2)} />
                <Tab label="People" {...a11yProps(3)} />
                {isTeacher() && (
                  <Tab label="Grade Management" {...a11yProps(4)} />
                )}
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
              News
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              <Exercises isTeacher={isTeacher} classId={id} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
              <GradeStructure isTeacher={isTeacher} classId={id} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}>
              <People classId={id} />
            </CustomTabPanel>
            {isTeacher() && (
              <CustomTabPanel value={value} index={4}>
                <GradeManagement classId={id} />
              </CustomTabPanel>
            )}
          </Box>
        </div>
      )}
    </>
  );
};

export default DetailClass;
