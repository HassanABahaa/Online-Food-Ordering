import { ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import CartItem from "../components/CartItem";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";

const Cart = () => {
  const { t } = useLanguage();
  const { items, totalPrice, clearCart } = useCart();

  return (
    <main className="page-shell two-column">
      <section className="content-panel">
        <div className="section-heading">
          <h1>{t("cart")}</h1>
          {items.length > 0 && (
            <button className="button ghost compact" type="button" onClick={clearCart}>
              <Trash2 size={17} />
              <span>{t("clearCart")}</span>
            </button>
          )}
        </div>

        <div className="cart-list">
          {items.map((item) => (
            <CartItem item={item} key={item.productId?._id || item.productId} />
          ))}
        </div>

        {!items.length && (
          <section className="empty-state">
            <ShoppingBag size={34} />
            <p>{t("emptyCart")}</p>
            <Link className="button compact" to="/">
              {t("continueShopping")}
            </Link>
          </section>
        )}
      </section>

      <aside className="summary-panel">
        <h2>{t("checkout")}</h2>
        <div className="summary-row">
          <span>{t("total")}</span>
          <strong>{totalPrice} EGP</strong>
        </div>
        <Link className={`button full ${!items.length ? "disabled" : ""}`} to="/checkout">
          {t("checkout")}
        </Link>
      </aside>
    </main>
  );
};

export default Cart;
