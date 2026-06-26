import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { orderApi } from "../api/order.api";
import OrderStatus from "../components/OrderStatus";
import { demoOrders } from "../data/demoData";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const readLocalOrders = () => JSON.parse(localStorage.getItem("food_orders") || "[]");

const OrderDetails = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const { language, t } = useLanguage();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const loadOrder = async () => {
      if (token && !token.startsWith("demo-") && !id.startsWith("local-")) {
        try {
          const data = await orderApi.getOrderById(id);
          setOrder(data.order);
          return;
        } catch (error) {
          // Local lookup follows.
        }
      }

      const localOrder = [...readLocalOrders(), ...demoOrders].find((item) => item._id === id);
      setOrder(localOrder || null);
    };

    loadOrder();
  }, [id, token]);

  if (!order) {
    return (
      <main className="page-shell">
        <section className="empty-state">{t("noOrders")}</section>
      </main>
    );
  }

  return (
    <main className="page-shell two-column">
      <section className="content-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">#{order._id}</p>
            <h1>{t("orderStatus")}</h1>
          </div>
          <Link className="button ghost compact" to="/orders">
            {t("orders")}
          </Link>
        </div>

        <OrderStatus status={order.status} />

        <div className="cart-list">
          {order.products.map((item) => (
            <article className="cart-item" key={item.productId?._id || item.productId}>
              <img src={item.image} alt={item.name?.[language]} />
              <div className="cart-item-main">
                <h3>{item.name?.[language]}</h3>
                <p className="muted">{item.quantity} x {item.itemPrice} EGP</p>
              </div>
              <strong>{item.totalPrice} EGP</strong>
            </article>
          ))}
        </div>
      </section>

      <aside className="summary-panel">
        <h2>{t("checkout")}</h2>
        <div className="summary-row">
          <span>{t("address")}</span>
          <strong>{order.address}</strong>
        </div>
        <div className="summary-row">
          <span>{t("phone")}</span>
          <strong>{order.phone}</strong>
        </div>
        <div className="summary-row">
          <span>{t("payment")}</span>
          <strong>{t(order.paymentMethod)}</strong>
        </div>
        <div className="summary-row">
          <span>{t("total")}</span>
          <strong>{order.totalPrice} EGP</strong>
        </div>
      </aside>
    </main>
  );
};

export default OrderDetails;
