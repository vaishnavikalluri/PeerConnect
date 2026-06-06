import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import { signup } from '../services/authService.js'

function Signup() {
	const navigate = useNavigate()
	const [formData, setFormData] = useState({ name: '', email: '', password: '' })
	const [status, setStatus] = useState({ type: '', message: '' })
	const [isSubmitting, setIsSubmitting] = useState(false)

	const handleChange = (event) => {
		const { name, value } = event.target
		setFormData((current) => ({ ...current, [name]: value }))
	}

	const handleSubmit = async (event) => {
		event.preventDefault()
		setIsSubmitting(true)
		setStatus({ type: '', message: '' })

		try {
			await signup(formData)
			setStatus({ type: 'success', message: 'Signup successful. Please log in now.' })
			navigate('/login')
		} catch (error) {
			setStatus({
				type: 'error',
				message: error?.response?.data?.message || 'Signup failed',
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<PageShell
			eyebrow="Create account"
			title="Sign up for PeerConnect"
			description="Use this placeholder page to verify the signup route and wire up onboarding later."
		>
			<section className="form-card">
				<h2>Signup form</h2>
				<p>Create your account, then move straight to login and testing.</p>
				{status.message ? (
					<p className={status.type === 'error' ? 'form-message form-message--error' : 'form-message form-message--success'}>
						{status.message}
					</p>
				) : null}
				<form className="form-grid" onSubmit={handleSubmit}>
					<label>
						Full name
						<input
							name="name"
							type="text"
							placeholder="Alex Johnson"
							value={formData.name}
							onChange={handleChange}
							required
						/>
					</label>
					<label>
						Email
						<input
							name="email"
							type="email"
							placeholder="you@example.com"
							value={formData.email}
							onChange={handleChange}
							required
						/>
					</label>
					<label>
						Password
						<input
							name="password"
							type="password"
							placeholder="Create a password"
							value={formData.password}
							onChange={handleChange}
							required
						/>
					</label>
					<button type="submit" className="button button--primary" disabled={isSubmitting}>
						{isSubmitting ? 'Creating...' : 'Create account'}
					</button>
					<Link to="/login" className="inline-link">
						Already have an account?
					</Link>
				</form>
			</section>
		</PageShell>
	)
}

export default Signup
