import axiosClient from "./axiosClient";

const gradeApi = {
  getGradeStructures: (classId) => {
    return axiosClient.get(`/api/classroom/${classId}/grade-structure`);
  },
  createGradeStructure: (classId, data) => {
    return axiosClient.post(`/api/classroom/${classId}/grade-structure`, data);
  },
  deleteGradeStructure: (classId, id) => {
    return axiosClient.delete(`/api/classroom/${classId}/grade-structure/${id}`);
  },
  updateGradeStructureById: (classId, id, data) => {
    return axiosClient.put(`/api/classroom/${classId}/grade-structure/${id}`, data);
  },
  updateGradeStructures: (classId, data) => {
    return axiosClient.put(`/api/classroom/${classId}/grade-structure`, data);
  },
  markGradeCompositionFinalized: (classId, id) => {
    return axiosClient.put(`/api/classroom/${classId}/grade-structure/${id}/mark-finalized`);
  }
};

export default gradeApi;
