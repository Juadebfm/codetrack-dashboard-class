import PropTypes from "prop-types";

function AuthLayout({ children, heroDescription, heroTitle }) {
  return (
    <main className="auth-page">
      <div className="auth-shell">
        <section className="auth-form-panel">{children}</section>
        <aside className="auth-side-panel" aria-label="CodeTrack learning streak">
          <div className="auth-hero">
            <div className="auth-brand">
              <img className="auth-favicon" src="/images/codetrack-logo-sept.png" alt="" />
              <img className="auth-wordmark" src="/images/codetrack-logo-name.png" alt="CodeTrack" />
            </div>
            <img className="auth-heatmap" src="/images/auth-heat.png" alt="" />
            <h2>{heroTitle}</h2>
            <p>{heroDescription}</p>
            <span className="auth-hero-note">✓</span>
            <span>Free forever for your daily log.</span>
          </div>
        </aside>
      </div>
    </main>
  );
}

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
  heroDescription: PropTypes.string.isRequired,
  heroTitle: PropTypes.string.isRequired,
};

export default AuthLayout;
