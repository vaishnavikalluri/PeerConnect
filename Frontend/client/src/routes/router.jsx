import { createBrowserRouter } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout.jsx'
import Contact from '../pages/Contact.jsx'
import Dashboard from '../pages/Dashboard.jsx'
import EditProfile from '../pages/EditProfile.jsx'
import Home from '../pages/Home.jsx'
import Login from '../pages/Login.jsx'
import Profile from '../pages/Profile.jsx'
import PublicProfile from '../pages/PublicProfile.jsx'
import Requests from '../pages/Requests.jsx'
import Search from '../pages/Search.jsx'
import Signup from '../pages/Signup.jsx'

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'search', element: <Search /> },
      { path: 'profile', element: <Profile /> },
      { path: 'profile/edit', element: <EditProfile /> },
      { path: 'users/:id', element: <PublicProfile /> },
      { path: 'requests', element: <Requests /> },
      { path: 'contact', element: <Contact /> },
    ],
  },
])