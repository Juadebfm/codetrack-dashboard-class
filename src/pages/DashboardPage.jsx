import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import MetricCard from "../components/dashboard/MetricCard";
import useDashboard from "../hooks/useDashboard";

function DashboardPage() {
  const { dashboard } = useDashboard();

  return (
    <div>
      <DashboardSidebar
        displayName={dashboard.profile.display_name}
        plan={dashboard.profile.plan}
      />
      <main>
        <DashboardHeader
          displayName={dashboard.profile.display_name}
          today={dashboard.today}
        />
        <section aria-label="Dashboard summary">
          <MetricCard
            label="Current streak"
            value={dashboard.currentStreak}
            unit="days"
            helperText={`Personal best: ${dashboard.personalBest} days`}
          />
          <MetricCard
            label="Days logged this month"
            value={dashboard.daysLoggedThisMonth}
            unit=""
            helperText={`of ${dashboard.daysElapsedThisMonth} days so far`}
          />
          <MetricCard
            label="Hours this week"
            value={dashboard.thisWeekHours}
            unit="hrs"
            helperText={`${dashboard.weeklyHoursChange >= 0 ? "+" : ""}${dashboard.weeklyHoursChange.toFixed(1)} vs last week`}
          />
        </section>
      </main>
    </div>
  );
}

export default DashboardPage;
