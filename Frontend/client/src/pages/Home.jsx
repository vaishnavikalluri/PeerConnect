import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'

function Home() {
	return (
		<PageShell
			eyebrow="Welcome"
			title="Connect with peers who are building, learning, and collaborating."
			description="PeerConnect gives you a quick place to discover people, manage requests, and keep your professional profile up to date."
			actions={
				<>
					<Link to="/signup" className="button button--primary">
						Get Started
					</Link>
					<Link to="/search" className="button button--ghost">
						Browse Users
					</Link>
				</>
			}
		>
			<section className="stats-grid">
				<article className="stat-card">
					<strong>Discover people</strong>
					<p>Search by name, role, or interest and open public profiles instantly.</p>
				</article>
				<article className="stat-card">
					<strong>Manage requests</strong>
					<p>Track pending connections and follow up without leaving the app.</p>
				</article>
				<article className="stat-card">
					<strong>Update your profile</strong>
					<p>Keep your current and public profile views ready for sharing.</p>
				</article>
			</section>
		</PageShell>
	)
}

export default Home
