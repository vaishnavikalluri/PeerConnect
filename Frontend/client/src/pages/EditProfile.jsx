import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { getProfile, updateProfile } from '../services/userService.js'

function EditProfile() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [form, setForm] = useState({
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
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadProfile = async () => {
      if (!isAuthenticated) {
        setStatus({ type: 'error', message: 'Log in to edit your profile.' })
        return
      }

      try {
        const response = await getProfile()
        const user = response.data.user || {}
        setForm({
          profileImage: user.profileImage || '',
          college: user.college || '',
          year: user.year || '',
          location: user.location || '',
          bio: user.bio || '',
          githubLink: user.githubLink || '',
          linkedinLink: user.linkedinLink || '',
          portfolioLink: user.portfolioLink || '',
          experienceLevel: user.experienceLevel || 'Beginner',
          projects: Array.isArray(user.projects) ? user.projects.join('\n') : '',
          offeredSkills: Array.isArray(user.offeredSkills) ? user.offeredSkills.join(', ') : '',
          wantedSkills: Array.isArray(user.wantedSkills) ? user.wantedSkills.join(', ') : '',
        })
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
    setForm((current) => ({ ...current, [name]: value }))
  }

  const splitLines = (value) =>
    value
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean)

  const splitCommaList = (value) =>
    value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setStatus({ type: '', message: '' })

    try {
      await updateProfile({
        profileImage: form.profileImage,
        college: form.college,
        year: form.year ? Number(form.year) : undefined,
        location: form.location,
        bio: form.bio,
        githubLink: form.githubLink,
        linkedinLink: form.linkedinLink,
        portfolioLink: form.portfolioLink,
        experienceLevel: form.experienceLevel,
        projects: splitLines(form.projects),
        offeredSkills: splitCommaList(form.offeredSkills),
        wantedSkills: splitCommaList(form.wantedSkills),
      })

      setStatus({ type: 'success', message: 'Profile updated successfully.' })
      navigate('/profile')
    } catch (error) {
      setStatus({
        type: 'error',
        message: error?.response?.data?.message || 'Failed to update profile',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageShell
      eyebrow="Profile settings"
      title="Edit profile"
      description="Update the authenticated user profile directly from the backend."
      actions={
        <Link to="/profile" className="button button--ghost">
          Back to profile
        </Link>
      }
    >
      <section className="form-card">
        <h2>Edit profile form</h2>
        <p>These fields map to the backend update endpoint.</p>
        {status.message ? (
          <p className={status.type === 'error' ? 'form-message form-message--error' : 'form-message form-message--success'}>
            {status.message}
          </p>
        ) : null}
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Profile image URL
            <input name="profileImage" value={form.profileImage} onChange={handleChange} type="text" placeholder="https://..." />
          </label>
          <label>
            College
            <input name="college" value={form.college} onChange={handleChange} type="text" placeholder="PeerConnect University" />
          </label>
          <label>
            Year
            <input name="year" value={form.year} onChange={handleChange} type="text" placeholder="3" />
          </label>
          <label>
            Location
            <input name="location" value={form.location} onChange={handleChange} type="text" placeholder="Remote" />
          </label>
          <label>
            Bio
            <textarea name="bio" value={form.bio} onChange={handleChange} placeholder="Write a short summary about yourself." />
          </label>
          <label>
            GitHub link
            <input name="githubLink" value={form.githubLink} onChange={handleChange} type="text" placeholder="https://github.com/yourname" />
          </label>
          <label>
            LinkedIn link
            <input name="linkedinLink" value={form.linkedinLink} onChange={handleChange} type="text" placeholder="https://linkedin.com/in/yourname" />
          </label>
          <label>
            Portfolio link
            <input name="portfolioLink" value={form.portfolioLink} onChange={handleChange} type="text" placeholder="https://yourportfolio.com" />
          </label>
          <label>
            Experience level
            <select name="experienceLevel" value={form.experienceLevel} onChange={handleChange}>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </label>
          <label>
            Projects, one per line
            <textarea name="projects" value={form.projects} onChange={handleChange} placeholder="Project 1\nProject 2" />
          </label>
          <label>
            Offered skills, comma separated
            <input name="offeredSkills" value={form.offeredSkills} onChange={handleChange} type="text" placeholder="React, Node, UI" />
          </label>
          <label>
            Wanted skills, comma separated
            <input name="wantedSkills" value={form.wantedSkills} onChange={handleChange} type="text" placeholder="GraphQL, Docker" />
          </label>
          <button type="submit" className="button button--primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </section>
    </PageShell>
  )
}

export default EditProfile