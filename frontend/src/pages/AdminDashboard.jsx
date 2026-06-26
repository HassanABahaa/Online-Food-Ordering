import { Banknote, ClipboardList, PackageCheck, Users, Utensils } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../api/admin.api";
import { demoOrders, demoProducts } from "../data/demoData";
import { useLanguage } from "../context/LanguageContext";

const Stat = ({ icon: Icon, label, value }) => (
  <article className="stat-card">
    <span>
      <Icon size={22} />
    </span>
    <div>
      <p>{label}</p>
      <strong>{value}</strong>
    </div>
  </article>
);

const AdminDashboard = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    productsCount: 0,
    usersCount: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await adminApi.getStats();
        setStats(data.stats);
      } catch (error) {
        setStats({
          totalOrders: demoOrders.length,
          totalRevenue: demoOrders.reduce((total, order) => total + order.totalPrice, 0),
          pendingOrders: demoOrders.filter((order) => order.status !== "delivered").length,
          deliveredOrders: demoOrders.filter((order) => order.status === "delivered").length,
          productsCount: demoProducts.length,
          usersCount: 1,
        });
      }
    };

    loadStats();
  }, []);

  return (
    <main className="page-shell">
      <section className="section-heading">
        <div>
          <p className="eyebrow">{t("admin")}</p>
          <h1>{t("dashboard")}</h1>
        </div>
        <div className="admin-actions">
          <Link className="button compact" to="/admin/products">
            <Utensils size={17} />
            <span>{t("products")}</span>
          </Link>
          <Link className="button compact secondary" to="/admin/orders">
            <ClipboardList size={17} />
            <span>{t("allOrders")}</span>
          </Link>
        </div>
      </section>

      <section className="stats-grid">
        <Stat icon={ClipboardList} label={t("totalOrders")} value={stats.totalOrders} />
        <Stat icon={Banknote} label={t("revenue")} value={`${stats.totalRevenue} EGP`} />
        <Stat icon={PackageCheck} label={t("pendingOrders")} value={stats.pendingOrders} />
        <Stat icon={PackageCheck} label={t("deliveredOrders")} value={stats.deliveredOrders} />
        <Stat icon={Utensils} label={t("productsCount")} value={stats.productsCount} />
        <Stat icon={Users} label={t("usersCount")} value={stats.usersCount} />
      </section>
    </main>
  );
};

export default AdminDashboard;
