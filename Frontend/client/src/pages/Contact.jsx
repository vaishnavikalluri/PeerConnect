import { useState } from 'react'
import PageShell from '../components/PageShell.jsx'
import { submitContactForm } from '../services/contactService.js'

function Contact() {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		subject: '',
		message: '',
	})
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
			await submitContactForm(formData)
			setStatus({ type: 'success', message: 'Contact form submitted successfully.' })
			setFormData({ name: '', email: '', subject: '', message: '' })
		} catch (error) {
			setStatus({
				type: 'error',
				message: error?.response?.data?.message || 'Failed to submit contact form',
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<PageShell
			eyebrow="Support"
			title="Contact PeerConnect"
			description="Submit a live contact form to the backend from the frontend itself."
		>
			<section className="page-card">
				<h2>Send a message</h2>
				<p>All fields are validated by the backend and a success email is triggered.</p>
				{status.message ? (
					<p className={status.type === 'error' ? 'form-message form-message--error' : 'form-message form-message--success'}>
						{status.message}
					</p>
				) : null}
				<form className="form-grid" onSubmit={handleSubmit}>
					<label>
						Name
						<input name="name" value={formData.name} onChange={handleChange} required />
					</label>
					<label>
						Email
						<input name="email" type="email" value={formData.email} onChange={handleChange} required />
					</label>
					<label>
						Subject
						<input name="subject" value={formData.subject} onChange={handleChange} required />
					</label>
					<label>
						Message
						<textarea name="message" value={formData.message} onChange={handleChange} required />
					</label>
					<button type="submit" className="button button--primary" disabled={isSubmitting}>
						{isSubmitting ? 'Sending...' : 'Send Message'}
					</button>
				</form>
			</section>
		</PageShell>
	)
}

export default Contact
