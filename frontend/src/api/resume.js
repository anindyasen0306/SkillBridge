import api from './axiosInstance'

export const resumeApi = {
  analyze: (formData) =>
    api.post('/api/resume/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  getHistory: (page = 1, pageSize = 10) =>
    api.get('/api/resume/history', { params: { page, page_size: pageSize } }),

  getAnalysis: (id) => api.get(`/api/resume/history/${id}`),

  deleteAnalysis: (id) => api.delete(`/api/resume/history/${id}`),
}
