import {
  ClipboardList,
  LayoutDashboard,
  LogOut,
  ShoppingCart,
  User,
  Utensils,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import LanguageToggle from "./LanguageToggle";

const Navbar = () => {
  const { t } = useLanguage();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemsCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="app-header">
      <NavLink className="brand" to="/">
        <span className="brand-icon">
          <Utensils size={22} />
        </span>
        <span>{t("appName")}</span>
      </NavLink>

      <nav className="main-nav" aria-label="Main navigation">
        <NavLink to="/" end>
          <Utensils size={18} />
          <span>{t("menu")}</span>
        </NavLink>
        <NavLink to="/cart">
          <ShoppingCart size={18} />
          <span>{t("cart")}</span>
          {itemsCount > 0 && <strong className="nav-badge">{itemsCount}</strong>}
        </NavLink>
        <NavLink to="/orders">
          <ClipboardList size={18} />
          <span>{t("orders")}</span>
        </NavLink>
        {isAdmin && (
          <NavLink to="/admin">
            <LayoutDashboard size={18} />
            <span>{t("admin")}</span>
          </NavLink>
        )}
      </nav>

      <div className="header-actions">
        <LanguageToggle />
        {isAuthenticated ? (
          <>
            <span className="user-chip" title={user?.email}>
              <User size={16} />
              <span>{user?.userName}</span>
            </span>
            <button className="icon-button" type="button" onClick={handleLogout} title={t("logout")}>
              <LogOut size={18} />
            </button>
          </>
        ) : (
          <NavLink className="button compact" to="/login">
            <User size={17} />
            <span>{t("login")}</span>
          </NavLink>
        )}
      </div>
    </header>
  );
};

export default Navbar;
