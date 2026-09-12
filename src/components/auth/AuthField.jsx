import PropTypes from "prop-types";

function AuthField({ error, label, name, onChange, placeholder, type, value }) {
  return (
    <label className="auth-field" htmlFor={name}>
      <span>{label} <b aria-hidden="true">*</b></span>
      <input
        aria-describedby={error ? `${name}-error` : undefined}
        aria-invalid={Boolean(error)}
        id={name}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        value={value}
      />
      {error && <small id={`${name}-error`}>{typeof error === "string" ? error : "!"}</small>}
    </label>
  );
}

AuthField.propTypes = {
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default AuthField;
