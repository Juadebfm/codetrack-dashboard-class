import { useState } from "react";
import PropTypes from "prop-types";
import { GitFork } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AuthField from "../components/auth/AuthField";
import AuthLayout from "../components/auth/AuthLayout";
import PasswordField from "../components/auth/PasswordField";
import useAuth from "../hooks/useAuth";

const emptySignInForm = { email: "", password: "" };
const emptySignUpForm = { displayName: "", email: "", password: "" };

function AuthPage({ mode }) {
  const isSignUp = mode === "signup";
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(isSignUp ? emptySignUpForm : emptySignInForm);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({ ...currentForm, [name]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [name]: false }));
    setFormError("");
    setFormMessage("");
  };

  const validate = () => {
    const nextErrors = {};

    if (isSignUp && form.displayName.trim().length < 2) {
      nextErrors.displayName = "Enter your name.";
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      nextErrors.email = "!";
    }

    if (form.password.length < 8) {
      nextErrors.password = "!";
    }

    return nextErrors;
  };

  const submitForm = async (event) => {
    event.preventDefault();
    const nextErrors = validate();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    setFormError("");
    setFormMessage("");
    try {
      const result = isSignUp ? await signUp(form) : await signIn(form.email, form.password);

      if (isSignUp) {
        setFormMessage(result.message || "Account created. Check your email to verify it.");
        return;
      }

      navigate("/dashboard");
    } catch (error) {
      setFormError(error.message);
      if (!isSignUp) setErrors({ email: true, password: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  const title = isSignUp ? "Create your account" : "Welcome back";
  const description = isSignUp
    ? "Start your streak in under a minute."
    : "Log in to keep your streak going.";
  const heroTitle = isSignUp ? "Day 1 starts here." : "Keep the chain alive.";
  const heroDescription = isSignUp
    ? "Create your account and log your first session today. Tomorrow, you'll have a 2-day streak."
    : "You're one log away from extending your streak. Pick up right where you left off.";

  return (
    <AuthLayout heroDescription={heroDescription} heroTitle={heroTitle}>
      <div className="auth-form">
        <h1>{title}</h1>
        <p className="auth-description">{description}</p>

        <div className="social-buttons">
          <button type="button"><GitFork aria-hidden="true" size={18} /> Continue with GitHub</button>
          <button type="button"><span className="google-letter" aria-hidden="true">G</span> Continue with Google</button>
        </div>

        <div className="auth-divider"><span>or</span></div>
        {formError && <p className="auth-alert" role="alert">! &nbsp;{formError}</p>}
        {formMessage && <p className="auth-success" role="status">{formMessage}</p>}

        <form noValidate onSubmit={submitForm}>
          {isSignUp && (
            <AuthField
              error={errors.displayName}
              label="Name"
              name="displayName"
              onChange={updateField}
              placeholder="Alex Rivera"
              type="text"
              value={form.displayName}
            />
          )}
          <AuthField
            error={errors.email}
            label="Email"
            name="email"
            onChange={updateField}
            placeholder="you@example.com"
            type="email"
            value={form.email}
          />
          <PasswordField
            error={errors.password}
            onChange={updateField}
            placeholder={isSignUp ? "At least 8 characters" : "Your password"}
            value={form.password}
          />
          {isSignUp && <p className="password-help">Use at least 8 characters.</p>}

          {!isSignUp && (
            <div className="auth-options">
              <label>
                <input
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  type="checkbox"
                />
                Remember me
              </label>
              <button type="button">Forgot password?</button>
            </div>
          )}

          <button className="auth-submit" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Please wait..." : isSignUp ? "Create account" : "Log in"}
          </button>
        </form>

        {isSignUp && (
          <p className="auth-terms">
            By signing up you agree to our <button type="button">Terms</button> and <button type="button">Privacy Policy</button>.
          </p>
        )}

        <p className="auth-switch">
          {isSignUp ? "Already have an account?" : "New here?"}{" "}
          <Link to={isSignUp ? "/signin" : "/signup"}>
            {isSignUp ? "Log in." : "Create an account."}
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

AuthPage.propTypes = {
  mode: PropTypes.oneOf(["signin", "signup"]).isRequired,
};

export default AuthPage;
