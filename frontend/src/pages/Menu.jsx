import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { productApi } from "../api/product.api";
import ProductCard from "../components/ProductCard";
import { categories, demoProducts } from "../data/demoData";
import { useLanguage } from "../context/LanguageContext";

const Menu = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [keyword, setKeyword] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await productApi.getProducts();
        if (!active) return;
        setProducts(data.products || []);
        setNotice("");
      } catch (error) {
        if (!active) return;
        setProducts(demoProducts);
        setNotice(t("apiOffline"));
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProducts();
    return () => {
      active = false;
    };
    // Fetch once; category/keyword are filtered locally for an instant response.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectCategory = (value) => {
    setCategory(value);
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set("category", value);
    } else {
      next.delete("category");
    }
    setSearchParams(next, { replace: true });
  };

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
          onClick={() => selectCategory("")}
        >
          {t("all")}
        </button>
        {categories.map((item) => (
          <button
            className={`chip ${category === item ? "active" : ""}`}
            type="button"
            key={item}
            onClick={() => selectCategory(item)}
          >
            {t(item)}
          </button>
        ))}
      </section>

      {notice && <p className="notice">{notice}</p>}

      <section className="product-grid">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <article className="product-card skeleton-card" key={index} aria-hidden="true">
                <div className="skeleton-image" />
                <div className="product-content">
                  <div>
                    <div className="skeleton-line short" />
                    <div className="skeleton-line" />
                    <div className="skeleton-line" />
                  </div>
                  <div className="skeleton-line short" />
                </div>
              </article>
            ))
          : visibleProducts.map((product) => (
              <ProductCard product={product} key={product._id} />
            ))}
      </section>

      {!loading && !visibleProducts.length && (
        <section className="empty-state">{t("noProducts")}</section>
      )}
    </main>
  );
};

export default Menu;
