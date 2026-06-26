import { ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";

const ProductCard = ({ product }) => {
  const { language, t } = useLanguage();
  const { addProduct } = useCart();

  return (
    <article className="product-card">
      <img src={product.image} alt={product.name[language]} />
      <div className="product-content">
        <div>
          <p className="product-category">{t(product.category)}</p>
          <h3>{product.name[language]}</h3>
          <p className="muted">{product.description[language]}</p>
        </div>
        <div className="product-footer">
          <strong>{product.price} EGP</strong>
          <button className="button compact" type="button" onClick={() => addProduct(product)}>
            <ShoppingCart size={17} />
            <span>{t("addToCart")}</span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
