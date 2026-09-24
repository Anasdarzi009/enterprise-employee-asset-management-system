import api from './api';

export const employeeService = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.departmentId) query.append('departmentId', params.departmentId);
    if (params.status) query.append('status', params.status);

    const qs = query.toString();
    const response = await api.get(`/employees${qs ? `?${qs}` : ''}`);
    return response.data || [];
  },

  getDepartments: async () => {
    const response = await api.get('/employees/departments');
    return response.data || [];
  },

  getById: async (id) => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  create: async (employeeData) => {
    const response = await api.post('/employees', employeeData);
    return response;
  },

  update: async (id, employeeData) => {
    const response = await api.put(`/employees/${id}`, employeeData);
    return response;
  },

  delete: async (id) => {
    const response = await api.delete(`/employees/${id}`);
    return response;
  }
};
