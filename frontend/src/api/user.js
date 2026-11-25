import api from './axiosInstance'

export const userApi = {
  getProfile:    ()     => api.get('/api/user/profile'),
  updateProfile: (data) => api.put('/api/user/profile', data),
}
