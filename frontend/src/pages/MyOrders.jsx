import { ClipboardList } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { orderApi } from "../api/order.api";
import OrderStatus from "../components/OrderStatus";
import { demoOrders } from "../data/demoData";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const readLocalOrders = () => JSON.parse(localStorage.getItem("food_orders") || "[]");

const MyOrders = () => {
  const { t } = useLanguage();
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadOrders = async () => {
      if (!token || token.startsWith("demo-")) {
        setOrders([...readLocalOrders(), ...demoOrders]);
        return;
      }

      try {
        const data = await orderApi.getMyOrders();
        setOrders(data.orders || []);
      } catch (error) {
        setOrders([...readLocalOrders(), ...demoOrders]);
      }
    };

    loadOrders();
  }, [token]);

  return (
    <main className="page-shell">
      <section className="content-panel">
        <div className="section-heading">
          <h1>{t("orders")}</h1>
        </div>

        <div className="orders-list">
          {orders.map((order) => (
            <article className="order-card" key={order._id}>
              <div>
                <p className="eyebrow">#{order._id}</p>
                <strong>{order.totalPrice} EGP</strong>
                <p className="muted">{t(order.paymentMethod)} - {t(order.paymentStatus)}</p>
              </div>
              <OrderStatus status={order.status} />
              <Link className="button compact" to={`/orders/${order._id}`}>
                <ClipboardList size={17} />
                <span>{t("viewDetails")}</span>
              </Link>
            </article>
          ))}
        </div>

        {!orders.length && <section className="empty-state">{t("noOrders")}</section>}
      </section>
    </main>
  );
};

export default MyOrders;
