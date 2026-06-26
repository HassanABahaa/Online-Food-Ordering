import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";

const CartItem = ({ item }) => {
  const { language } = useLanguage();
  const { updateQuantity, removeProduct } = useCart();

  const productId = item.productId?._id || item.productId;

  return (
    <article className="cart-item">
      <img src={item.image} alt={item.name?.[language]} />
      <div className="cart-item-main">
        <h3>{item.name?.[language]}</h3>
        <p className="muted">{item.itemPrice} EGP</p>
      </div>
      <div className="quantity-control">
        <button
          className="icon-button"
          type="button"
          onClick={() => updateQuantity(productId, Math.max(1, item.quantity - 1))}
          aria-label="Decrease quantity"
        >
          <Minus size={16} />
        </button>
        <span>{item.quantity}</span>
        <button
          className="icon-button"
          type="button"
          onClick={() => updateQuantity(productId, item.quantity + 1)}
          aria-label="Increase quantity"
        >
          <Plus size={16} />
        </button>
      </div>
      <strong>{item.totalPrice} EGP</strong>
      <button
        className="icon-button danger"
        type="button"
        onClick={() => removeProduct(productId)}
        aria-label="Remove item"
      >
        <Trash2 size={17} />
      </button>
    </article>
  );
};

export default CartItem;
