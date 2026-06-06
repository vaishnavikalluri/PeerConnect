import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import { login } from '../services/authService.js'
import { useAuth } from '../hooks/useAuth.js'

function Login() {
	const navigate = useNavigate()
	const { setAuth } = useAuth()
	const [formData, setFormData] = useState({ email: '', password: '' })
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
			const response = await login(formData)
			setAuth({ token: response.data.token, user: response.data.user })
			setStatus({ type: 'success', message: 'Login successful. Redirecting to dashboard.' })
			navigate('/dashboard')
		} catch (error) {
			setStatus({
				type: 'error',
				message: error?.response?.data?.message || 'Login failed',
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<PageShell
			eyebrow="Authentication"
			title="Login to your account"
			description="This page is a placeholder for the login flow so routing can be tested immediately."
		>
			<section className="form-card">
				<h2>Login form</h2>
				<p>Sign in to store your JWT and unlock the authenticated pages.</p>
				{status.message ? (
					<p className={status.type === 'error' ? 'form-message form-message--error' : 'form-message form-message--success'}>
						{status.message}
					</p>
				) : null}
				<form className="form-grid" onSubmit={handleSubmit}>
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
							placeholder="Enter your password"
							value={formData.password}
							onChange={handleChange}
							required
						/>
					</label>
					<button type="submit" className="button button--primary" disabled={isSubmitting}>
						{isSubmitting ? 'Signing in...' : 'Sign in'}
					</button>
					<Link to="/signup" className="inline-link">
						Create an account instead
					</Link>
				</form>
			</section>
		</PageShell>
	)
}

export default Login
