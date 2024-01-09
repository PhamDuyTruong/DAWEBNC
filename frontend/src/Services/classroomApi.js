import axiosClient from "./axiosClient";
import axios from "./axios";
import { configAxios } from "../utils/customUser";

const classroomApi = {
  createClassroom: async (data) => {
    try {
      const response = await axios.post(
        "/classroom/role-teacher",
        data,
        configAxios
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getClassroom: () => {
    return axiosClient.get("/api/classroom");
  },
  getClassroomByCreatedUser: () => {
    return axiosClient.get("/api/classroom/teacher/me");
  },
  getAllParticipatedClassroom: () => {
    return axiosClient.get("/api/classroom/participate/me");
  },
  getClassroomById: (id) => {
    return axiosClient.get(`/api/classroom/${id}`);
  },
  checkUserJoinClass: (id) => {
    return axiosClient.get(`/api/classroom/${id}/account-joined`);
  },
  getClassroomByInvitationCode: (id,code) => {
    return axiosClient.get(`/api/classroom/${id}/join/link?cjc=${code}`);
  },
  joinClassByInvitationCode: (id, code) => {
    return axiosClient.post(`/api/classroom/accept/link`, { id, code });
  },
  sendInvitationViaEmail: (id, data) => {
    return axiosClient.post(`/api/classroom/${id}/invite/email`, data);
  },
  joinClassByEmail: (id, token) => {
    return axiosClient.post(`/api/classroom/accept/email`, { id, token });
  },
  joinClassByCode: (code) => {
    return axiosClient.post(`/api/classroom/accept/code`, { code });
  },
  deleteClassroom: (id) => {
    return axiosClient.delete(`/api/classroom/role-teacher/${id}`);
  },
  updateClassroom: (id, data) => {
    return axiosClient.put(`/api/classroom/role-teacher/${id}`, data);
  },
  
};

export default classroomApi;
