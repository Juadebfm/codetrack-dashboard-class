import useAuth from "../hooks/useAuth";

function DashboardPage() {
  const { currentUser } = useAuth();

  return (
    <main className="dashboard-page">
      <h1>Welcome In {currentUser.display_name}</h1>
    </main>
  );
}

export default DashboardPage;
