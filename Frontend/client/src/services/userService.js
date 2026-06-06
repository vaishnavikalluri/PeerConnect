import api from './api'

export const getProfile = () => api.get('/users/profile')

export const updateProfile = (payload) => api.put('/users/profileUpdate', payload)

export const getAllUsers = () => api.get('/users/all')

export const searchUsers = (queryOrParams = {}) => {
  const params =
    typeof queryOrParams === 'string' ? { skill: queryOrParams } : queryOrParams

  return api.get('/users/search', { params })
}

export default {
  getProfile,
  updateProfile,
  getAllUsers,
  searchUsers,
}