import axiosClient from "./axiosClient";
import axios from "./axios";
import { configAxios } from "../utils/customUser";

const gradeReviewApi = {
  createGradeReview: async (studentId, classId, assignmentId, data) => {
    return await axiosClient.post(
      `/api/gradeReview/student/${studentId}/classroom/${classId}/assignment/${assignmentId}`,
      data
    );
  },
  getGradeReviewByClassRoom: async (classId) => {
    return await axiosClient.get(`/api/gradeReview/classroom/${classId}`);
  },
  getGradeReviewById: async (id) => {
    return await axiosClient.get(`/api/gradeReview/${id}`);
  },
  getGradeViewByClassRoomAndStudentId: async (classId, studentId) => {
    return await axiosClient.get(
      `/api/gradeReview/classroom/${classId}/student/${studentId}`
    );
  },
  createComment: async (id, data) => {
    return await axiosClient.post(`/api/gradeReview/${id}/comment`, data);
  },
  updateGradeReviewStatus: async (id, status) => {
    return await axiosClient.put(`/api/gradeReview/${id}/status`, { status });
  }
};

export default gradeReviewApi;
