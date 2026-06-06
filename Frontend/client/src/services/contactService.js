import api from './api'

export const submitContactForm = (payload) => api.post('/contact', payload)

export default {
  submitContactForm,
}