import { MailCheck, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyEmail, resendVerification } = useAuth();
  const [form, setForm] = useState({
    email: location.state?.email || "",
    otp: "",
  });
  const [message, setMessage] = useState("Check your email and enter the 6-digit code.");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const updateField = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await verifyEmail(form);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!form.email) {
      setError("Please enter your email first");
      return;
    }

    setError("");
    setResending(true);

    try {
      await resendVerification({ email: form.email });
      setMessage("A new verification code has been sent to your email.");
    } catch (err) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <main className="auth-page">
      <form className="form-panel" onSubmit={handleSubmit}>
        <h1>Verify Email</h1>
        {message && <p className="muted">{message}</p>}
        {error && <p className="form-error">{error}</p>}
        <label>
          <span>Email</span>
          <input
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            required
          />
        </label>
        <label>
          <span>Verification code</span>
          <input
            value={form.otp}
            onChange={(event) => updateField("otp", event.target.value.replace(/\D/g, "").slice(0, 6))}
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            required
          />
        </label>
        <button className="button full" type="submit" disabled={loading}>
          <MailCheck size={18} />
          <span>Verify account</span>
        </button>
        <button className="button ghost full" type="button" onClick={handleResend} disabled={resending}>
          <RotateCcw size={18} />
          <span>Resend code</span>
        </button>
        <Link className="text-link" to="/login">
          Back to login
        </Link>
      </form>
    </main>
  );
};

export default VerifyEmail;
