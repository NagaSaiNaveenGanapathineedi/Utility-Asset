import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import RootLayout, {
  RedirectIfAuthenticated,
  RequireAuth,
  RequireRole,
  LandingPage,
  LoginPage,
  RegisterPage,
  UserDashboard,
  AdminDashboard,
  SupervisorDashboard,
  TechnicianDashboard
} from './App.jsx'
import './index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      // Public routes
      { path: '/', element: (
          <RedirectIfAuthenticated>
            <LandingPage />
          </RedirectIfAuthenticated>
        )
      },
      { path: '/login', element: (
          <RedirectIfAuthenticated>
            <LoginPage />
          </RedirectIfAuthenticated>
        )
      },
      { path: '/register', element: (
          <RedirectIfAuthenticated>
            <RegisterPage />
          </RedirectIfAuthenticated>
        )
      },

      // Protected routes
      { path: '/dashboard', element: (
          <RequireAuth>
            <UserDashboard />
          </RequireAuth>
        )
      },
      { path: '/admin-dashboard', element: (
          <RequireRole role="admin">
            <AdminDashboard />
          </RequireRole>
        )
      },
      { path: '/supervisor-dashboard', element: (
          <RequireRole role="supervisor">
            <SupervisorDashboard />
          </RequireRole>
        )
      },
      { path: '/technician-dashboard', element: (
          <RequireRole role="technician">
            <TechnicianDashboard />
          </RequireRole>
        )
      },
      // Catch-all: redirect to login if not authed, else to their role dashboard
      { path: '*', element: (
          <RedirectIfAuthenticated>
            <LoginPage />
          </RedirectIfAuthenticated>
        )
      },
    ]
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider
      router={router}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    />
  </React.StrictMode>,
) 