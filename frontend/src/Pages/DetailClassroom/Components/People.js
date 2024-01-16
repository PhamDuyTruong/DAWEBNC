import React, { useState, useEffect } from "react";
import { Divider, Dropdown, Modal, message } from "antd";
import {
  MoreOutlined,
  UsergroupAddOutlined,
  DeleteOutlined,
  MailOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import classroomApi from "../../../Services/classroomApi";
import validateEmail from "../../../utils/validateEmail";

const People = ({ classId }) => {
  const [classroom, setClassroom] = useState({});

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

  const menuProps = (item) => {
    let items = [
      {
        label: "Send email",
        key: "0",
        icon: <MailOutlined />,
        onClick: () => {},
      },
      {
        label: "Delete",
        key: "1",
        icon: <DeleteOutlined />,
        onClick: () => {},
      },
    ];

    return {
      items,
    };
  };

  const [isModalTeacherOpen, setIsModalTeacherOpen] = useState(false);
  const [isModalStudentOpen, setIsModalStudentOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [mail, setMail] = useState("");

  const userInfo = JSON.parse(localStorage.getItem("user"));

  const showTeacherModal = () => {
    setIsModalTeacherOpen(true);
  };

  const handleTeacherCancel = () => {
    setIsModalTeacherOpen(false);
    setMail("");
  };

  const showStudentModal = () => {
    setIsModalStudentOpen(true);
  };

  const handleStudentCancel = () => {
    setIsModalStudentOpen(false);
    setMail("");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `https://edulearning.vercel.app/classroom/${classroom._id}/join/link?cjc=${classroom.invitationCode}`
    );
    message.success("Copied to clipboard");
  };

  const handleSendMail = async (role) => {
    setConfirmLoading(true);
    if (validateEmail(mail)) {
      try {
        const response = await classroomApi.sendInvitationViaEmail(
          classroom._id,
          {
            email: mail,
            role: role,
          }
        );
        console.log(response);
        message.success("Send mail successfully");
      } catch (error) {
        message.error(error.response.data.message);
        console.log(error);
      } finally {
        setConfirmLoading(false);
      }
    } else {
      message.error("Invalid email");
    }
    setMail("");
  };

  return (
    <div>
      <div className="w-full flex justify-between items-center p-3 border-b border-b-blue-600">
        <h2 className=" text-blue-600">Teachers</h2>
        {classroom.createdUser == userInfo._id && (
          <div className="flex items-center justify-center py-2 px-[12px] rounded-full cursor-pointer hover:bg-slate-200/60">
            <UsergroupAddOutlined
              className="text-2xl text-blue-600"
              onClick={showTeacherModal}
            />
          </div>
        )}
      </div>
      <div>
        {classroom.teachers?.map((teacher) => (
          <div
            key={teacher._id}
            className={`flex items-center justify-between p-3 border-b border-b-gray-200 ${
              !teacher.isJoined && "grayscale text-gray-400"
            }`}
          >
            <div className="flex items-center gap-4 ">
              <img
                src={
                  teacher.profilePic
                    ? teacher.profilePic
                    : "https://i.pravatar.cc/150?img=56"
                }
                className="w-[50px] h-[50px] rounded-full"
              />
              <div className="flex items-center text-xl ">
                {!teacher.isJoined && teacher.isInvited
                  ? teacher.email + " (invited)"
                  : teacher.fullname}
              </div>
            </div>
            {classroom.createdUser == userInfo._id &&
              classroom.createdUser != teacher.accountId && (
                <div>
                  <Dropdown.Button
                    menu={menuProps(teacher)}
                    trigger={["click"]}
                    buttonsRender={([]) => [
                      <div />,
                      <div className="cursor-pointer p-2 rounded-3xl hover:bg-zinc-400/10">
                        <MoreOutlined className="text-[32px] text-slate-500" />
                      </div>,
                    ]}
                  />
                </div>
              )}
          </div>
        ))}
      </div>
      <Modal
        title="Invite teacher"
        open={isModalTeacherOpen}
        onOk={() => handleSendMail("TEACHER")}
        onCancel={handleTeacherCancel}
        okButtonProps={{ disabled: !validateEmail(mail) }}
        confirmLoading={confirmLoading}
      >
        <input
          type="email"
          value={mail}
          placeholder="Enter email"
          className="w-full border border-gray-300 rounded-md p-2"
          onChange={(e) => setMail(e.target.value)}
        />
        <p className="mt-2 text-sm text-gray-400">
          Teacher to be added can do everything as you can, except for deleting
          the classroom
        </p>
      </Modal>
      <div className="w-full flex justify-between items-center p-3 border-b border-b-blue-600">
        <h2 className=" text-blue-600">Students</h2>
        {classroom.createdUser == userInfo._id && (
          <div className="flex items-center justify-center py-2 px-[12px] rounded-full cursor-pointer hover:bg-slate-200/60">
            <UsergroupAddOutlined
              className="text-2xl text-blue-600"
              onClick={showStudentModal}
            />
          </div>
        )}
      </div>
      <div>
        {classroom.students?.map((student) => (
          <div
            key={student._id}
            className={`flex items-center justify-between p-3 border-b border-b-gray-200 ${
              !student.isJoined && "grayscale text-gray-400"
            }`}
          >
            <div className="flex items-center gap-4 ">
              <img
                src={
                  student.profilePic
                    ? student.profilePic
                    : "https://i.pravatar.cc/150?img=56"
                }
                className="w-[50px] h-[50px] rounded-full"
              />
              <div className="flex items-center text-xl ">
                {!student.isJoined && student.isInvited
                  ? student.email + " (invited)"
                  : student.fullname}
              </div>
            </div>
            {classroom.createdUser === userInfo._id && (
              <div>
                <Dropdown.Button
                  menu={menuProps(student)}
                  trigger={["click"]}
                  buttonsRender={([]) => [
                    <div />,
                    <div className="cursor-pointer p-2 rounded-3xl hover:bg-zinc-400/10">
                      <MoreOutlined className="text-[32px] text-slate-500" />
                    </div>,
                  ]}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      <Modal
        title="Invite student"
        open={isModalStudentOpen}
        onOk={() => handleSendMail("STUDENT")}
        onCancel={handleStudentCancel}
        okButtonProps={{ disabled: !validateEmail(mail) }}
        confirmLoading={confirmLoading}
      >
        <span className="mt-8 font-semibold">Invitation link</span>
        <div className="flex items-baseline -mt-2 space-y-2">
          <div className="truncate">
            https://edulearning.vercel.app/classroom/{classroom._id}
            /join/link?cjc=
            {classroom.invitationCode}
          </div>
          <div className="w-12 flex items-center justify-center cursor-pointer p-2 rounded-3xl hover:bg-zinc-400/10">
            <CopyOutlined
              className="text-xl text-blue-600 cursor-pointer"
              onClick={handleCopyLink}
            />
          </div>
        </div>
        <Divider className="mt-1" />
        <input
          type="email"
          value={mail}
          placeholder="Enter email"
          className="w-full border border-gray-300 rounded-md p-2"
          onChange={(e) => setMail(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default People;
