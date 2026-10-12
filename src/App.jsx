import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import DashboardPage from "./pages/DashboardPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";

function ProtectedDashboard() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <main className="dashboard-page">Checking your session...</main>;
  }

  return isAuthenticated ? <DashboardPage /> : <Navigate to="/signin" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route path="/dashboard" element={<ProtectedDashboard />} />
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
