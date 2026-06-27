import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const CustomerRoute = ({ children, requireAuth = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();

  if (loading) return <main className="page-shell">{t("pending")}</main>;

  if (isAdmin) return <Navigate to="/admin" replace />;

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};

export default CustomerRoute;
