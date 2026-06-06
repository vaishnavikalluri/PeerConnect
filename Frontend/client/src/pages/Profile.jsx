import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import { getProfile, updateProfile } from '../services/userService.js'
import { useAuth } from '../hooks/useAuth.js'

function Profile() {
	const { isAuthenticated } = useAuth()
	const [profile, setProfile] = useState(null)
	const [formData, setFormData] = useState({
		profileImage: '',
		college: '',
		year: '',
		location: '',
		bio: '',
		githubLink: '',
		linkedinLink: '',
		portfolioLink: '',
		experienceLevel: 'Beginner',
		projects: '',
		offeredSkills: '',
		wantedSkills: '',
	})
	const [status, setStatus] = useState({ type: '', message: '' })
	const [isSaving, setIsSaving] = useState(false)

	useEffect(() => {
		const loadProfile = async () => {
			if (!isAuthenticated) {
				setStatus({ type: 'error', message: 'Log in to view and edit your profile.' })
				return
			}

			try {
				const response = await getProfile()
				setProfile(response.data.user)
				const user = response.data.user || {}
				setFormData({
					profileImage: user.profileImage || '',
					college: user.college || '',
					year: user.year || '',
					location: user.location || '',
					bio: user.bio || '',
					githubLink: user.githubLink || '',
					linkedinLink: user.linkedinLink || '',
					portfolioLink: user.portfolioLink || '',
					experienceLevel: user.experienceLevel || 'Beginner',
					projects: Array.isArray(user.projects) ? user.projects.join(', ') : '',
					offeredSkills: Array.isArray(user.offeredSkills) ? user.offeredSkills.join(', ') : '',
					wantedSkills: Array.isArray(user.wantedSkills) ? user.wantedSkills.join(', ') : '',
				})
				setStatus({ type: 'success', message: 'Profile loaded from the API.' })
			} catch (error) {
				setStatus({
					type: 'error',
					message: error?.response?.data?.message || 'Failed to load profile',
				})
			}
		}

		loadProfile()
	}, [isAuthenticated])

	const handleChange = (event) => {
		const { name, value } = event.target
		setFormData((current) => ({ ...current, [name]: value }))
	}

	const handleSubmit = async (event) => {
		event.preventDefault()
		setIsSaving(true)
		setStatus({ type: '', message: '' })

		try {
			const payload = {
				...formData,
				year: formData.year ? Number(formData.year) : undefined,
				projects: formData.projects
					? formData.projects.split(',').map((item) => item.trim()).filter(Boolean)
					: [],
				offeredSkills: formData.offeredSkills
					? formData.offeredSkills.split(',').map((item) => item.trim()).filter(Boolean)
					: [],
				wantedSkills: formData.wantedSkills
					? formData.wantedSkills.split(',').map((item) => item.trim()).filter(Boolean)
					: [],
			}

			Object.keys(payload).forEach((key) => {
				if (payload[key] === undefined || payload[key] === '') {
					delete payload[key]
				}
			})

			const response = await updateProfile(payload)
			setProfile(response.data.user)
			setStatus({ type: 'success', message: 'Profile updated successfully.' })
		} catch (error) {
			setStatus({
				type: 'error',
				message: error?.response?.data?.message || 'Failed to update profile',
			})
		} finally {
			setIsSaving(false)
		}
	}

	return (
		<PageShell
			eyebrow="Profile"
			title="Current user profile"
			description="View and update your authenticated profile directly from the backend."
			actions={
				<Link to="/profile/edit" className="button button--primary">
					Edit Profile
				</Link>
			}
		>
			{status.message ? (
				<p className={status.type === 'error' ? 'form-message form-message--error' : 'form-message form-message--success'}>
					{status.message}
				</p>
			) : null}
			<section className="profile-grid">
				<article className="profile-panel">
					<h2>{profile?.name || 'About you'}</h2>
					<p>{profile?.bio || 'Display the current user bio, headline, and profile summary in this area.'}</p>
					<div className="pill-row">
						<span className="pill">{profile?.college || 'College not set'}</span>
						<span className="pill">{profile?.location || 'Location not set'}</span>
					</div>
				</article>
				<article className="profile-panel">
					<h2>Update profile</h2>
					<form className="form-grid" onSubmit={handleSubmit}>
						<label>
							Profile image URL
							<input name="profileImage" value={formData.profileImage} onChange={handleChange} />
						</label>
						<label>
							College
							<input name="college" value={formData.college} onChange={handleChange} />
						</label>
						<label>
							Year
							<input name="year" type="number" value={formData.year} onChange={handleChange} />
						</label>
						<label>
							Location
							<input name="location" value={formData.location} onChange={handleChange} />
						</label>
						<label>
							Bio
							<textarea name="bio" value={formData.bio} onChange={handleChange} />
						</label>
						<label>
							GitHub link
							<input name="githubLink" value={formData.githubLink} onChange={handleChange} />
						</label>
						<label>
							LinkedIn link
							<input name="linkedinLink" value={formData.linkedinLink} onChange={handleChange} />
						</label>
						<label>
							Portfolio link
							<input name="portfolioLink" value={formData.portfolioLink} onChange={handleChange} />
						</label>
						<label>
							Experience level
							<select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange}>
								<option>Beginner</option>
								<option>Intermediate</option>
								<option>Advanced</option>
							</select>
						</label>
						<label>
							Projects comma separated
							<input name="projects" value={formData.projects} onChange={handleChange} />
						</label>
						<label>
							Offered skills comma separated
							<input name="offeredSkills" value={formData.offeredSkills} onChange={handleChange} />
						</label>
						<label>
							Wanted skills comma separated
							<input name="wantedSkills" value={formData.wantedSkills} onChange={handleChange} />
						</label>
						<button type="submit" className="button button--primary" disabled={isSaving}>
							{isSaving ? 'Saving...' : 'Save changes'}
						</button>
					</form>
				</article>
			</section>
			<section className="profile-grid">
				<article className="profile-panel">
					<h2>Highlights</h2>
					<div className="profile-metrics">
						<div className="metric-row">
							<span>Connections</span>
							<span>{profile ? 'Loaded' : 'N/A'}</span>
						</div>
						<div className="metric-row">
							<span>Email</span>
							<span>{profile?.email || 'Not available'}</span>
						</div>
						<div className="metric-row">
							<span>Experience</span>
							<span>{profile?.experienceLevel || 'Not set'}</span>
						</div>
					</div>
				</article>
				<article className="profile-panel">
					<h2>Quick links</h2>
					<div className="pill-row">
						<Link to="/search" className="inline-link">Search users</Link>
						<Link to="/requests" className="inline-link">Requests</Link>
						<Link to="/contact" className="inline-link">Contact</Link>
					</div>
				</article>
			</section>
		</PageShell>
	)
}

export default Profile
