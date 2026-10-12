import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";
import useAuth from "../hooks/useAuth";

function EmailVerificationPage() {
  const [searchParams] = useSearchParams();
  const { verifyEmail } = useAuth();
  const token = searchParams.get("token");
  const [message, setMessage] = useState(() =>
    token ? "Verifying your email..." : "This verification link is missing its token.",
  );
  const [hasError, setHasError] = useState(!token);
  const [isVerified, setIsVerified] = useState(false);
  const verificationRequest = useRef(null);

  useEffect(() => {
    let isActive = true;

    if (!token) {
      return () => {
        isActive = false;
      };
    }

    verificationRequest.current ??= verifyEmail(token);
    verificationRequest.current
      .then((response) => {
        if (isActive) {
          setMessage(response.message);
          setIsVerified(true);
        }
      })
      .catch((error) => {
        if (isActive) {
          setMessage(error.message);
          setHasError(true);
        }
      });

    return () => {
      isActive = false;
    };
  }, [token, verifyEmail]);

  return (
    <AuthLayout heroDescription="Verify your email to keep your CodeTrack account secure." heroTitle="One quick check." >
      <div className="auth-form">
        <h1>Email verification</h1>
        <p className={hasError ? "auth-alert" : "auth-success"} role={hasError ? "alert" : "status"}>
          {message}
        </p>
        {isVerified && <Link to="/signin">Continue to log in</Link>}
      </div>
    </AuthLayout>
  );
}

export default EmailVerificationPage;
