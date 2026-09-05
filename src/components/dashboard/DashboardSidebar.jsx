import PropTypes from "prop-types";

function DashboardSidebar({ displayName, plan }) {
  return (
    <aside>
      <p>CodeTrack</p>
      <nav aria-label="Main navigation">
        <a href="/dashboard">Dashboard</a>
        <a href="/log">Log</a>
        <a href="/goals">Goals</a>
        <a href="/skills">Skills</a>
        <a href="/stats">Stats</a>
        <a href="/settings">Settings</a>
      </nav>
      <p>{displayName}</p>
      <p>{plan} plan</p>
    </aside>
  );
}

DashboardSidebar.propTypes = {
  displayName: PropTypes.string.isRequired,
  plan: PropTypes.string.isRequired,
};

export default DashboardSidebar;
