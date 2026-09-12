import { useState } from "react";
import PropTypes from "prop-types";

function PasswordField({ error, onChange, placeholder, value }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <label className="auth-field" htmlFor="password">
      <span>Password <b aria-hidden="true">*</b></span>
      <div className="password-input">
        <input
          aria-describedby={error ? "password-error" : undefined}
          aria-invalid={Boolean(error)}
          id="password"
          name="password"
          onChange={onChange}
          placeholder={placeholder}
          type={isVisible ? "text" : "password"}
          value={value}
        />
        <button
          aria-label={isVisible ? "Hide password" : "Show password"}
          onClick={() => setIsVisible((visible) => !visible)}
          type="button"
        >
          {isVisible ? "HIDE" : "SHOW"}
        </button>
      </div>
      {error && <small id="password-error">{typeof error === "string" ? error : "!"}</small>}
    </label>
  );
}

PasswordField.propTypes = {
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default PasswordField;
