import { useEffect, useState } from 'react'
import PageShell from '../components/PageShell.jsx'
import {
  acceptRequest,
  getReceivedRequests,
  getSentRequests,
  rejectRequest,
} from '../services/requestService.js'
import { useAuth } from '../hooks/useAuth.js'

function Requests() {
  const { isAuthenticated } = useAuth()
  const [sentRequests, setSentRequests] = useState([])
  const [receivedRequests, setReceivedRequests] = useState([])
  const [status, setStatus] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [actionId, setActionId] = useState(null)

  const loadRequests = async () => {
    if (!isAuthenticated) {
      setSentRequests([])
      setReceivedRequests([])
      setStatus({ type: 'error', message: 'Please log in to view requests.' })
      return
    }

    setLoading(true)
    setStatus({ type: '', message: '' })

    try {
      const [sentResponse, receivedResponse] = await Promise.all([
        getSentRequests(),
        getReceivedRequests(),
      ])

      setSentRequests(sentResponse.data.requests || [])
      setReceivedRequests(receivedResponse.data.requests || [])
    } catch (error) {
      setStatus({
        type: 'error',
        message: error?.response?.data?.message || 'Failed to load requests',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRequests()
  }, [isAuthenticated])

  const handleRequestAction = async (requestId, action) => {
    setActionId(requestId)
    setStatus({ type: '', message: '' })

    try {
      if (action === 'accept') {
        await acceptRequest(requestId)
      } else {
        await rejectRequest(requestId)
      }

      await loadRequests()
      setStatus({
        type: 'success',
        message: `Request ${action === 'accept' ? 'accepted' : 'rejected'} successfully.`,
      })
    } catch (error) {
      setStatus({
        type: 'error',
        message: error?.response?.data?.message || `Failed to ${action} request`,
      })
    } finally {
      setActionId(null)
    }
  }

  const renderPeer = (request, side) => {
    const peer = side === 'sent' ? request.receiver : request.sender
    const peerName = peer?.name || 'Unknown user'
    const peerEmail = peer?.email || 'No email available'

    return (
      <article key={request._id} className="request-item">
        <h3>{peerName}</h3>
        <p>{peerEmail}</p>
        <p>Status: {request.status}</p>
        {side === 'received' ? (
          <div className="hero-actions">
            <button
              type="button"
              className="button button--primary"
              onClick={() => handleRequestAction(request._id, 'accept')}
              disabled={actionId === request._id}
            >
              {actionId === request._id ? 'Working...' : 'Accept'}
            </button>
            <button
              type="button"
              className="button button--ghost"
              onClick={() => handleRequestAction(request._id, 'reject')}
              disabled={actionId === request._id}
            >
              Reject
            </button>
          </div>
        ) : null}
      </article>
    )
  }

  return (
    <PageShell
      eyebrow="Connections"
      title="Requests inbox"
      description="Review incoming and outgoing requests directly against the API."
    >
      {status.message ? (
        <p className={status.type === 'error' ? 'form-message form-message--error' : 'form-message form-message--success'}>
          {status.message}
        </p>
      ) : null}
      <section className="profile-grid">
        <div className="profile-panel">
          <h2>Received requests</h2>
          {loading ? <p className="muted">Loading...</p> : null}
          <div className="request-list">
            {receivedRequests.length > 0 ? (
              receivedRequests.map((request) => renderPeer(request, 'received'))
            ) : (
              <p className="muted">No received requests yet.</p>
            )}
          </div>
        </div>

        <div className="profile-panel">
          <h2>Sent requests</h2>
          <div className="request-list">
            {sentRequests.length > 0 ? (
              sentRequests.map((request) => renderPeer(request, 'sent'))
            ) : (
              <p className="muted">No sent requests yet.</p>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  )
}

export default Requests