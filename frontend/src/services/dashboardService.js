import api from './api';

export const dashboardService = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  getRecentAssignments: async () => {
    const response = await api.get('/dashboard/recent-assignments');
    return response.data || [];
  },

  getRecentEmployees: async () => {
    const response = await api.get('/dashboard/recent-employees');
    return response.data || [];
  }
};
