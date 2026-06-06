import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import { getAllUsers, searchUsers } from '../services/userService.js'
import { sendRequest } from '../services/requestService.js'
import { useAuth } from '../hooks/useAuth.js'

function Search() {
  const { isAuthenticated, user } = useAuth()
  const [skill, setSkill] = useState('')
  const [users, setUsers] = useState([])
  const [status, setStatus] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [requestingId, setRequestingId] = useState(null)

  const normalizedUsers = useMemo(
    () =>
      users.filter((item) => String(item._id || item.id) !== String(user?.id)),
    [user, users]
  )

  const loadUsers = async (nextSkill = '') => {
    if (!isAuthenticated) {
      setUsers([])
      setStatus({ type: 'error', message: 'Please log in to search users.' })
      return
    }

    setLoading(true)
    setStatus({ type: '', message: '' })

    try {
      const response = nextSkill.trim()
        ? await searchUsers(nextSkill.trim())
        : await getAllUsers()

      setUsers(response.data.users || [])
      setStatus({
        type: 'success',
        message:
          (response.data.count || response.data.users?.length || 0) > 0
            ? 'Users loaded from the API.'
            : 'No users matched the current query.',
      })
    } catch (error) {
      setUsers([])
      setStatus({
        type: 'error',
        message: error?.response?.data?.message || 'Unable to load users',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [isAuthenticated])

  const handleSubmit = async (event) => {
    event.preventDefault()
    await loadUsers(skill)
  }

  const handleRequest = async (receiverId) => {
    setRequestingId(receiverId)
    setStatus({ type: '', message: '' })

    try {
      await sendRequest({ receiverId })
      setStatus({ type: 'success', message: 'Request sent successfully.' })
    } catch (error) {
      setStatus({
        type: 'error',
        message: error?.response?.data?.message || 'Failed to send request',
      })
    } finally {
      setRequestingId(null)
    }
  }

  return (
    <PageShell
      eyebrow="Discovery"
      title="Search users"
      description="Use this route to surface people you want to connect with."
    >
      <section className="form-card">
        <h2>Search users from the API</h2>
        <p>Search by skill or load the full list of users after login.</p>
        {status.message ? (
          <p className={status.type === 'error' ? 'form-message form-message--error' : 'form-message form-message--success'}>
            {status.message}
          </p>
        ) : null}
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Search by skill
            <input
              value={skill}
              onChange={(event) => setSkill(event.target.value)}
              type="text"
              placeholder="e.g. React, Design, Node"
            />
          </label>
          <div className="hero-actions">
            <button type="submit" className="button button--primary" disabled={loading}>
              {loading ? 'Loading...' : 'Search'}
            </button>
            <button type="button" className="button button--ghost" onClick={() => loadUsers('')}>
              Load all users
            </button>
          </div>
        </form>
      </section>

      <section className="search-results">
        {normalizedUsers.map((item) => {
          const id = item._id || item.id

          return (
            <article key={id} className="result-card">
              <h3>{item.name}</h3>
              <p>{item.college || item.location || item.email || 'PeerConnect user'}</p>
              <div className="pill-row">
                <Link to={`/users/${id}`} className="inline-link">
                  Open profile
                </Link>
                <button
                  type="button"
                  className="button button--ghost"
                  onClick={() => handleRequest(id)}
                  disabled={requestingId === id}
                >
                  {requestingId === id ? 'Sending...' : 'Send request'}
                </button>
              </div>
            </article>
          )
        })}
      </section>
    </PageShell>
  )
}

export default Search