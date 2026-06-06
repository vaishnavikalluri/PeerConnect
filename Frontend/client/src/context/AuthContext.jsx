import { createContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

const readStoredAuth = () => {
	if (typeof window === 'undefined') {
		return { token: null, user: null }
	}

	const token = window.localStorage.getItem('token')
	const storedUser = window.localStorage.getItem('user')

	return {
		token,
		user: storedUser ? JSON.parse(storedUser) : null,
	}
}

export function AuthProvider({ children }) {
	const [authState, setAuthState] = useState(readStoredAuth)

	useEffect(() => {
		if (typeof window === 'undefined') {
			return
		}

		if (authState.token) {
			window.localStorage.setItem('token', authState.token)
		} else {
			window.localStorage.removeItem('token')
		}

		if (authState.user) {
			window.localStorage.setItem('user', JSON.stringify(authState.user))
		} else {
			window.localStorage.removeItem('user')
		}
	}, [authState])

	const value = useMemo(
		() => ({
			token: authState.token,
			user: authState.user,
			isAuthenticated: Boolean(authState.token),
			setAuth: ({ token, user }) => setAuthState({ token, user }),
			logout: () => setAuthState({ token: null, user: null }),
		}),
		[authState]
	)

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { AuthContext }
