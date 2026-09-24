import api from './api';

export const assetService = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.type) query.append('type', params.type);
    if (params.status) query.append('status', params.status);

    const qs = query.toString();
    const response = await api.get(`/assets${qs ? `?${qs}` : ''}`);
    return response.data || [];
  },

  getAvailable: async () => {
    const response = await api.get('/assets/available');
    return response.data || [];
  },

  getByEmployee: async (employeeId) => {
    const response = await api.get(`/assets/employee/${employeeId}`);
    return response.data || [];
  },

  getById: async (id) => {
    const response = await api.get(`/assets/${id}`);
    return response.data;
  },

  create: async (assetData) => {
    const response = await api.post('/assets', assetData);
    return response;
  },

  update: async (id, assetData) => {
    const response = await api.put(`/assets/${id}`, assetData);
    return response;
  },

  delete: async (id) => {
    const response = await api.delete(`/assets/${id}`);
    return response;
  }
};
