import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { sendRequest } from '../services/requestService.js'
import { getAllUsers } from '../services/userService.js'

function PublicProfile() {
  const { id } = useParams()
	const { isAuthenticated } = useAuth()
	const [profile, setProfile] = useState(null)
	const [status, setStatus] = useState('')
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		const loadUser = async () => {
			if (!isAuthenticated) {
				setStatus('Login to load public profiles from the backend.')
				return
			}

			setLoading(true)
			try {
				const response = await getAllUsers()
				const matchedUser = (response.data.users || []).find(
					(user) => String(user._id || user.id) === String(id)
				)
				setProfile(matchedUser || null)
			} catch (error) {
				setStatus(error?.response?.data?.message || 'Failed to load public profile')
			} finally {
				setLoading(false)
			}
		}

		loadUser()
	}, [id, isAuthenticated])

	const handleSendRequest = async () => {
		if (!id) {
			return
		}

		setStatus('')
		try {
			await sendRequest({ receiverId: id })
			setStatus('Connection request sent.')
		} catch (error) {
			setStatus(error?.response?.data?.message || 'Failed to send request')
		}
	}

  return (
    <PageShell
      eyebrow="Public profile"
      title={profile?.name || 'Public profile'}
      description="This route loads a selected user from the backend and can send them a connection request."
    >
      {status ? (
        <section className="page-card">
          <p className={status.includes('Failed') ? 'form-error' : 'form-success'}>{status}</p>
        </section>
      ) : null}

      <section className="profile-grid">
        <article className="profile-panel">
          <h2>About this user</h2>
          <p>{profile?.bio || 'Use this layout for public details, achievements, and a connect button.'}</p>
          <div className="pill-row">
            {(profile?.offeredSkills || []).slice(0, 3).map((skill) => (
              <span key={skill} className="pill">
                {skill}
              </span>
            ))}
          </div>
        </article>
        <article className="profile-panel">
          <h2>Public stats</h2>
          <div className="profile-metrics">
            <div className="metric-row">
              <span>Name</span>
              <span>{profile?.name || 'Loading...'}</span>
            </div>
            <div className="metric-row">
              <span>College</span>
              <span>{profile?.college || 'N/A'}</span>
            </div>
            <div className="metric-row">
              <span>Experience</span>
              <span>{profile?.experienceLevel || 'N/A'}</span>
            </div>
          </div>
          <div className="hero-actions">
            <button
              type="button"
              className="button button--primary"
              onClick={handleSendRequest}
              disabled={!isAuthenticated || loading}
            >
              Send request
            </button>
          </div>
        </article>
      </section>
    </PageShell>
  )
}

export default PublicProfile