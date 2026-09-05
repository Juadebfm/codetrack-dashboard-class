import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/AuthContext.jsx'
import { DashboardProvider } from './context/DashboardContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <DashboardProvider>
        <App />
      </DashboardProvider>
    </AuthProvider>
  </StrictMode>,
)
