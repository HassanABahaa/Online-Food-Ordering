import { UserPlus } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const Register = () => {
  const { t } = useLanguage();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    userName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await register(form);
      if (data.token) {
        navigate("/");
        return;
      }
      navigate("/verify-email", { state: { email: data.email || form.email } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <form className="form-panel wide" onSubmit={handleSubmit}>
        <h1>{t("register")}</h1>
        {error && <p className="form-error">{error}</p>}
        <label>
          <span>{t("userName")}</span>
          <input
            value={form.userName}
            minLength={3}
            maxLength={25}
            pattern="[A-Za-z\u0600-\u06FF][A-Za-z\u0600-\u06FF0-9 _-]{2,24}"
            title="User name must be 3-25 characters and contain only letters, numbers, spaces, _ or -"
            onChange={(event) => updateField("userName", event.target.value)}
            required
          />
        </label>
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
            minLength={8}
            maxLength={30}
            pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,30}"
            title="Password must include uppercase, lowercase and number"
            value={form.password}
            onChange={(event) => updateField("password", event.target.value)}
            required
          />
        </label>
        <label>
          <span>{t("phone")}</span>
          <input
            value={form.phone}
            type="tel"
            pattern="01[0125][0-9]{8}"
            title="Phone must be an Egyptian number that starts with 010, 011, 012 or 015"
            onChange={(event) => updateField("phone", event.target.value)}
          />
        </label>
        <label className="full-field">
          <span>{t("address")}</span>
          <input
            value={form.address}
            onChange={(event) => updateField("address", event.target.value)}
          />
        </label>
        <button className="button full" type="submit" disabled={loading}>
          <UserPlus size={18} />
          <span>{t("register")}</span>
        </button>
        <Link className="text-link" to="/login">
          {t("login")}
        </Link>
      </form>
    </main>
  );
};

export default Register;
