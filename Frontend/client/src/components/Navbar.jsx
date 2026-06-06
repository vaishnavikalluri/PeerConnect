import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

function Navbar() {
	const { isAuthenticated, user, logout } = useAuth()
	const linkClass = ({ isActive }) => `navbar__link${isActive ? ' active' : ''}`

	return (
		<header className="navbar">
			<div className="navbar__brand">
				<Link to="/" className="navbar__logo" aria-label="PeerConnect home">
					PC
				</Link>
				<div className="navbar__brand-copy">
					<p className="navbar__title">PeerConnect</p>
					<p className="navbar__subtitle">Find people, grow your network.</p>
				</div>
			</div>

			<nav className="navbar__links" aria-label="Primary navigation">
				<NavLink to="/" end className={linkClass}>
					Home
				</NavLink>
				<NavLink to="/search" className={linkClass}>
					Search Users
				</NavLink>
				<NavLink to="/requests" className={linkClass}>
					Requests
				</NavLink>
				<NavLink to="/contact" className={linkClass}>
					Contact
				</NavLink>
			</nav>

			<div className="navbar__actions">
					{isAuthenticated ? (
						<>
							<span className="navbar__subtitle">{user?.name || 'Signed in'}</span>
							<button type="button" className="button button--ghost" onClick={logout}>
								Logout
							</button>
						</>
					) : (
						<>
							<Link to="/login" className="button button--ghost">
								Login
							</Link>
							<Link to="/signup" className="button button--primary">
								Signup
							</Link>
						</>
					)}
			</div>
		</header>
	)
}

export default Navbar
