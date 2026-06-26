import { Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { adminApi } from "../api/admin.api";
import OrderStatus from "../components/OrderStatus";
import { demoOrders } from "../data/demoData";
import { useLanguage } from "../context/LanguageContext";

const statuses = ["placed", "preparing", "on_way", "delivered", "cancelled"];

const AdminOrders = () => {
  const { language, t } = useLanguage();
  const [orders, setOrders] = useState(demoOrders);
  const [status, setStatus] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await adminApi.getOrders({ status });
        setOrders(data.orders || []);
        setNotice("");
      } catch (error) {
        const localOrders = JSON.parse(localStorage.getItem("food_orders") || "[]");
        const allOrders = [...localOrders, ...demoOrders];
        setOrders(status ? allOrders.filter((order) => order.status === status) : allOrders);
        setNotice(t("apiOffline"));
      }
    };

    loadOrders();
  }, [status, t]);

  const updateStatus = async (orderId, nextStatus) => {
    try {
      const data = await adminApi.updateOrderStatus(orderId, nextStatus);
      setOrders((current) =>
        current.map((order) => (order._id === orderId ? data.order : order)),
      );
      setNotice("");
    } catch (error) {
      const nextOrders = orders.map((order) =>
        order._id === orderId ? { ...order, status: nextStatus } : order,
      );
      setOrders(nextOrders);
      localStorage.setItem(
        "food_orders",
        JSON.stringify(nextOrders.filter((order) => String(order._id).startsWith("local-"))),
      );
      setNotice(t("apiOffline"));
    }
  };

  return (
    <main className="page-shell">
      <section className="content-panel">
        <div className="section-heading">
          <h1>{t("allOrders")}</h1>
          <label className="select-filter">
            <Filter size={17} />
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="">{t("all")}</option>
              {statuses.map((item) => (
                <option value={item} key={item}>
                  {t(item)}
                </option>
              ))}
            </select>
          </label>
        </div>

        {notice && <p className="notice">{notice}</p>}

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{t("customer")}</th>
                <th>{t("products")}</th>
                <th>{t("payment")}</th>
                <th>{t("total")}</th>
                <th>{t("status")}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>
                    <strong>{order.user?.userName || "Customer"}</strong>
                    <p className="muted">{order.phone}</p>
                  </td>
                  <td>
                    {order.products.map((item) => (
                      <span className="line-item" key={item.productId?._id || item.productId}>
                        {item.quantity} x {item.name?.[language]}
                      </span>
                    ))}
                  </td>
                  <td>
                    <strong>{t(order.paymentMethod)}</strong>
                    <p className="muted">{t(order.paymentStatus)}</p>
                  </td>
                  <td>{order.totalPrice} EGP</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(event) => updateStatus(order._id, event.target.value)}
                    >
                      {statuses.map((item) => (
                        <option value={item} key={item}>
                          {t(item)}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="admin-order-cards">
          {orders.map((order) => (
            <article className="order-card" key={order._id}>
              <div>
                <p className="eyebrow">#{order._id}</p>
                <strong>{order.totalPrice} EGP</strong>
              </div>
              <OrderStatus status={order.status} />
            </article>
          ))}
        </div>

        {!orders.length && <section className="empty-state">{t("noOrders")}</section>}
      </section>
    </main>
  );
};

export default AdminOrders;
