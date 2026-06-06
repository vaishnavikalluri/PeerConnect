import api from './api'

export const sendRequest = (payload) => api.post('/requests/send', payload)

export const getSentRequests = () => api.get('/requests/sent')

export const getReceivedRequests = () => api.get('/requests/received')

export const acceptRequest = (requestId) => api.put(`/requests/accept/${requestId}`)

export const rejectRequest = (requestId) => api.put(`/requests/reject/${requestId}`)

export default {
  sendRequest,
  getSentRequests,
  getReceivedRequests,
  acceptRequest,
  rejectRequest,
}