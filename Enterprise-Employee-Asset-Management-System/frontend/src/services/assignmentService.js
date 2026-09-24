import api from './api';

export const assignmentService = {
  getAll: async () => {
    const response = await api.get('/assignments');
    return response.data || [];
  },

  assign: async (data) => {
    const response = await api.post('/assignments', data);
    return response;
  },

  returnAsset: async (id, returnData = {}) => {
    const response = await api.put(`/assignments/${id}/return`, returnData);
    return response;
  },

  getByEmployee: async (employeeId) => {
    const response = await api.get(`/assignments/employee/${employeeId}`);
    return response.data || [];
  },

  getByAsset: async (assetId) => {
    const response = await api.get(`/assignments/asset/${assetId}`);
    return response.data || [];
  }
};
