import { LogIn } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const Login = () => {
  const { t } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form);
      navigate(location.state?.from || "/", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <form className="form-panel" onSubmit={handleSubmit}>
        <h1>{t("login")}</h1>
        {error && <p className="form-error">{error}</p>}
        <label>
          <span>{t("email")}</span>
          <input
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            required
          />
        </label>
        <label>
          <span>{t("password")}</span>
          <input
            type="password"
            value={form.password}
            onChange={(event) => updateField("password", event.target.value)}
            required
          />
        </label>
        <button className="button full" type="submit" disabled={loading}>
          <LogIn size={18} />
          <span>{t("login")}</span>
        </button>
        <Link className="text-link" to="/register">
          {t("register")}
        </Link>
      </form>
    </main>
  );
};

export default Login;
