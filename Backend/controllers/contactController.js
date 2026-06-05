import Contact from '../models/Contact.js';
import { sendEmail } from '../services/emailService.js';

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const buildAdminEmailHtml = ({ name, email, subject, message }) => `
  <h2>New Contact Form Submission</h2>
  <p><strong>Name:</strong> ${name}</p>
  <p><strong>Email:</strong> ${email}</p>
  <p><strong>Subject:</strong> ${subject}</p>
  <p><strong>Message:</strong></p>
  <p>${message.replace(/\n/g, '<br />')}</p>
`;

const buildAcknowledgementEmailHtml = () => `
  <h2>We Received Your Message</h2>
  <p>Thank you for contacting PeerConnect.</p>
  <p>Our team will get back to you soon.</p>
`;

export const submitContactForm = async (req, res) => {
	try {
		const { name, email, subject, message } = req.body;
		const trimmedName = typeof name === 'string' ? name.trim() : '';
		const trimmedEmail = typeof email === 'string' ? email.trim() : '';
		const trimmedSubject = typeof subject === 'string' ? subject.trim() : '';
		const trimmedMessage = typeof message === 'string' ? message.trim() : '';

		if (!trimmedName || !trimmedEmail || !trimmedSubject || !trimmedMessage) {
			return res.status(400).json({ message: 'All fields are required' });
		}

		if (!isValidEmail(trimmedEmail)) {
			return res.status(400).json({ message: 'Please provide a valid email address' });
		}

		const contact = await Contact.create({
			name: trimmedName,
			email: trimmedEmail,
			subject: trimmedSubject,
			message: trimmedMessage,
		});

		const adminEmail = process.env.ADMIN_EMAIL || 'goldikalluri@gmail.com';

		await sendEmail(
			adminEmail,
			'New Contact Form Submission',
			buildAdminEmailHtml({
				name: trimmedName,
				email: trimmedEmail,
				subject: trimmedSubject,
				message: trimmedMessage,
			})
		);

		try {
			await sendEmail(
				trimmedEmail,
				'We Received Your Message',
				buildAcknowledgementEmailHtml()
			);
		} catch (acknowledgementError) {
			console.error('Acknowledgement email failed:', acknowledgementError.message);
		}

		return res.status(201).json({
			message: 'Contact form submitted successfully',
			contact,
		});
	} catch (error) {
		return res.status(500).json({
			message: 'Failed to submit contact form',
			error: error.message,
		});
	}
};
