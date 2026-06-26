import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { productApi } from "../api/product.api";
import ProductCard from "../components/ProductCard";
import { categories, demoProducts } from "../data/demoData";
import { useLanguage } from "../context/LanguageContext";

const Menu = () => {
  const { t } = useLanguage();
  const [products, setProducts] = useState(demoProducts);
  const [category, setCategory] = useState("");
  const [keyword, setKeyword] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await productApi.getProducts({ category, keyword });
        setProducts(data.products || []);
        setNotice("");
      } catch (error) {
        setProducts(demoProducts);
        setNotice(t("apiOffline"));
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [category, keyword, t]);

  const visibleProducts = useMemo(() => {
    const search = keyword.toLowerCase().trim();
    return products.filter((product) => {
      const matchesCategory = !category || product.category === category;
      const matchesSearch =
        !search ||
        product.name.en.toLowerCase().includes(search) ||
        product.name.ar.includes(keyword) ||
        product.description.en.toLowerCase().includes(search) ||
        product.description.ar.includes(keyword);

      return matchesCategory && matchesSearch;
    });
  }, [products, category, keyword]);

  return (
    <main className="page-shell">
      <section className="menu-hero">
        <div>
          <p className="eyebrow">{t("appName")}</p>
          <h1>{t("menu")}</h1>
          <p className="muted">
            Pizza, burgers, chicken, pasta, drinks, and dessert in one ordering flow.
          </p>
        </div>
        <div className="search-box">
          <Search size={18} />
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder={t("searchPlaceholder")}
          />
        </div>
      </section>

      <section className="toolbar" aria-label="Categories">
        <button
          className={`chip ${category === "" ? "active" : ""}`}
          type="button"
          onClick={() => setCategory("")}
        >
          {t("all")}
        </button>
        {categories.map((item) => (
          <button
            className={`chip ${category === item ? "active" : ""}`}
            type="button"
            key={item}
            onClick={() => setCategory(item)}
          >
            {t(item)}
          </button>
        ))}
      </section>

      {notice && <p className="notice">{notice}</p>}
      {loading && <p className="muted">{t("pending")}</p>}

      <section className="product-grid">
        {visibleProducts.map((product) => (
          <ProductCard product={product} key={product._id} />
        ))}
      </section>

      {!visibleProducts.length && <section className="empty-state">{t("noProducts")}</section>}
    </main>
  );
};

export default Menu;
