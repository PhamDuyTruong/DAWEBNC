import axios from "./axios";
import axiosClient from "./axiosClient";
import { configAxios } from "../utils/customUser";

const assignmentApi = {
  createAssignment: async (data, classId) => {
    try {
      const response = await axios.post(`/assignment/classroom/${classId}`, data, configAxios);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getAssignmentByClass: async (id) => {
    return axiosClient.get(`/api/assignment/${id}`);
  },

  getDetailAssignment: async (id) => {
    return axiosClient.get(`/api/assignment/detail/${id}`);
  },
  deleteAssignment: async (id, classId) => {
    try {
      const response = await axios.delete(`/assignment/${id}/classroom/${classId}`, configAxios);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default assignmentApi;
