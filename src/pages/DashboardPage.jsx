import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function DashboardPage() {
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSignOut = async () => {
    setError("");
    try {
      await signOut();
      navigate("/signin");
    } catch (signOutError) {
      setError(signOutError.message);
    }
  };

  return (
    <main className="dashboard-page">
      <h1>Welcome In {currentUser.displayName}</h1>
      {error && <p className="auth-alert" role="alert">{error}</p>}
      <button onClick={handleSignOut} type="button">Log out</button>
    </main>
  );
}

export default DashboardPage;
