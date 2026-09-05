import PropTypes from "prop-types";

function MetricCard({ label, value, unit, helperText }) {
  return (
    <article>
      <p>{label}</p>
      <p>
        {value} {unit}
      </p>
      <p>{helperText}</p>
    </article>
  );
}

MetricCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  unit: PropTypes.string.isRequired,
  helperText: PropTypes.string.isRequired,
};

export default MetricCard;
