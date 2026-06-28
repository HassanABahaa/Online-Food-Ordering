import { MailCheck, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const VerifyEmail = () => {
  const location = useLocation();
  const { resendVerification } = useAuth();
  const [email, setEmail] = useState(location.state?.email || "");
  const [message, setMessage] = useState("We sent an activation link to your email. Open it to activate your account, then login.");
  const [error, setError] = useState("");
  const [resending, setResending] = useState(false);

  const handleResend = async (event) => {
    event.preventDefault();

    if (!email) {
      setError("Please enter your email first");
      return;
    }

    setError("");
    setResending(true);

    try {
      await resendVerification({ email });
      setMessage("A new activation link has been sent to your email.");
    } catch (err) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <main className="auth-page">
      <form className="form-panel" onSubmit={handleResend}>
        <h1>Check your email</h1>
        <MailCheck size={38} className="auth-icon" />
        {message && <p className="muted">{message}</p>}
        {error && <p className="form-error">{error}</p>}
        <label>
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <button className="button ghost full" type="submit" disabled={resending}>
          <RotateCcw size={18} />
          <span>Resend activation link</span>
        </button>
        <Link className="text-link" to="/login">
          Back to login
        </Link>
      </form>
    </main>
  );
};

export default VerifyEmail;
