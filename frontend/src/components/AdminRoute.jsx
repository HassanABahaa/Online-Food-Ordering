import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const { t } = useLanguage();

  if (loading) return <main className="page-shell">{t("pending")}</main>;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (!isAdmin) {
    return (
      <main className="page-shell">
        <section className="empty-state">{t("adminRequired")}</section>
      </main>
    );
  }

  return children;
};

export default AdminRoute;
