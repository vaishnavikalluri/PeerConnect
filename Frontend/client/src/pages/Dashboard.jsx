import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import { getProfile } from '../services/userService.js'
import { useAuth } from '../hooks/useAuth.js'

function Dashboard() {
	const { isAuthenticated } = useAuth()
	const [profile, setProfile] = useState(null)
	const [status, setStatus] = useState({ type: '', message: '' })

	useEffect(() => {
		const loadProfile = async () => {
			if (!isAuthenticated) {
				setProfile(null)
				setStatus({ type: 'error', message: 'Log in to load your dashboard data.' })
				return
			}

			try {
				const response = await getProfile()
				setProfile(response.data.user)
				setStatus({ type: 'success', message: 'Dashboard loaded from the API.' })
			} catch (error) {
				setStatus({
					type: 'error',
					message: error?.response?.data?.message || 'Failed to load dashboard',
				})
			}
		}

		loadProfile()
	}, [isAuthenticated])

	return (
		<PageShell
			eyebrow="Workspace"
			title="Dashboard overview"
			description="This page now pulls the signed-in user from the backend to confirm auth connectivity."
			actions={
				<Link to="/profile" className="button button--primary">
					View Profile
				</Link>
			}
		>
			{status.message ? (
				<p className={status.type === 'error' ? 'form-message form-message--error' : 'form-message form-message--success'}>
					{status.message}
				</p>
			) : null}
			<section className="feature-grid">
				<article className="feature-card">
					<h3>Signed-in user</h3>
					<p>{profile ? `${profile.name} (${profile.email})` : 'No user loaded yet.'}</p>
				</article>
				<article className="feature-card">
					<h3>Recent activity</h3>
					<p>Use requests, search, and profile updates to test the live backend.</p>
				</article>
				<article className="feature-card">
					<h3>Suggested connections</h3>
					<p>Surface recommended users based on shared interests or communities.</p>
				</article>
			</section>
		</PageShell>
	)
}

export default Dashboard
