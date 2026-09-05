import PropTypes from "prop-types";

function DashboardHeader({ displayName, today }) {
  return (
    <header>
      <h1>Good evening, {displayName}</h1>
      <p>{today}</p>
    </header>
  );
}

DashboardHeader.propTypes = {
  displayName: PropTypes.string.isRequired,
  today: PropTypes.string.isRequired,
};

export default DashboardHeader;
