import { Banknote, CreditCard } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { orderApi } from "../api/order.api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";

const saveLocalOrder = (order) => {
  const saved = JSON.parse(localStorage.getItem("food_orders") || "[]");
  localStorage.setItem("food_orders", JSON.stringify([order, ...saved]));
};

const Checkout = () => {
  const { t } = useLanguage();
  const { user, token } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    address: user?.address || "",
    phone: user?.phone || "",
    paymentMethod: "cash",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!items.length) {
      navigate("/cart");
      return;
    }

    setLoading(true);

    try {
      let order;

      if (token && !token.startsWith("demo-")) {
        const data = await orderApi.createOrder(form);
        order = data.order;
      } else {
        order = {
          _id: `local-${Date.now()}`,
          products: items,
          address: form.address,
          phone: form.phone,
          paymentMethod: form.paymentMethod,
          paymentStatus: form.paymentMethod === "online" ? "paid" : "pending",
          status: "placed",
          totalPrice,
          createdAt: new Date().toISOString(),
        };
        saveLocalOrder(order);
      }

      await clearCart();
      navigate(`/orders/${order._id}`);
    } catch (err) {
      const order = {
        _id: `local-${Date.now()}`,
        products: items,
        address: form.address,
        phone: form.phone,
        paymentMethod: form.paymentMethod,
        paymentStatus: form.paymentMethod === "online" ? "paid" : "pending",
        status: "placed",
        totalPrice,
        createdAt: new Date().toISOString(),
      };
      saveLocalOrder(order);
      await clearCart();
      navigate(`/orders/${order._id}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-shell two-column">
      <form className="content-panel form-panel checkout-form" onSubmit={handleSubmit}>
        <h1>{t("checkout")}</h1>
        {error && <p className="form-error">{error}</p>}
        <label>
          <span>{t("address")}</span>
          <input
            value={form.address}
            onChange={(event) => updateField("address", event.target.value)}
            required
          />
        </label>
        <label>
          <span>{t("phone")}</span>
          <input
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            required
          />
        </label>
        <fieldset className="payment-options">
          <legend>{t("paymentMethod")}</legend>
          <label className={form.paymentMethod === "cash" ? "selected" : ""}>
            <input
              type="radio"
              name="paymentMethod"
              value="cash"
              checked={form.paymentMethod === "cash"}
              onChange={(event) => updateField("paymentMethod", event.target.value)}
            />
            <Banknote size={19} />
            <span>{t("cash")}</span>
          </label>
          <label className={form.paymentMethod === "online" ? "selected" : ""}>
            <input
              type="radio"
              name="paymentMethod"
              value="online"
              checked={form.paymentMethod === "online"}
              onChange={(event) => updateField("paymentMethod", event.target.value)}
            />
            <CreditCard size={19} />
            <span>{t("online")}</span>
          </label>
        </fieldset>
        <button className="button full" type="submit" disabled={loading || !items.length}>
          {t("placeOrder")}
        </button>
      </form>

      <aside className="summary-panel">
        <h2>{t("total")}</h2>
        <strong className="summary-total">{totalPrice} EGP</strong>
        <div className="summary-list">
          {items.map((item) => (
            <div className="summary-row" key={item.productId?._id || item.productId}>
              <span>{item.quantity} x {item.name?.en}</span>
              <strong>{item.totalPrice} EGP</strong>
            </div>
          ))}
        </div>
      </aside>
    </main>
  );
};

export default Checkout;
