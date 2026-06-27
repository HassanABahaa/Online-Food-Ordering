import {
  ArrowRight,
  CreditCard,
  Globe,
  MapPin,
  Truck,
  UtensilsCrossed,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { productApi } from "../api/product.api";
import ProductCard from "../components/ProductCard";
import { categories, demoProducts } from "../data/demoData";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const categoryImages = {
  pizza: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=70",
  burger: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=70",
  chicken: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=500&q=70",
  pasta: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=500&q=70",
  drinks: "https://images.unsplash.com/photo-1437418747212-8d9709afab22?auto=format&fit=crop&w=500&q=70",
  dessert: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=500&q=70",
};

const Home = () => {
  const { t, direction } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const data = await productApi.getProducts();
        if (active) setProducts(data.products?.length ? data.products : demoProducts);
      } catch (error) {
        if (active) setProducts(demoProducts);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, []);

  const featured = useMemo(() => products.slice(0, 3), [products]);

  const features = [
    { icon: Truck, title: t("featureFastTitle"), text: t("featureFastText") },
    { icon: CreditCard, title: t("featurePayTitle"), text: t("featurePayText") },
    { icon: MapPin, title: t("featureTrackTitle"), text: t("featureTrackText") },
    { icon: Globe, title: t("featureLangTitle"), text: t("featureLangText") },
  ];

  return (
    <main className="home">
      <section className="hero">
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-inner">
          <div className="hero-content">
            <span className="pill-badge">
              <UtensilsCrossed size={15} />
              {t("appName")}
            </span>
            <h1>{t("heroTitle")}</h1>
            <p className="hero-sub">{t("heroSubtitle")}</p>
            <div className="hero-actions">
              <NavLink className="button lg" to="/menu">
                {t("browseMenu")}
                <ArrowRight size={18} className={direction === "rtl" ? "flip-x" : ""} />
              </NavLink>
              {!isAuthenticated && (
                <NavLink className="button ghost lg" to="/login">
                  {t("login")}
                </NavLink>
              )}
            </div>
            <div className="hero-stats">
              <div>
                <strong>{Math.max(products.length, 6)}+</strong>
                <span>{t("mealsLabel")}</span>
              </div>
              <div>
                <strong>2</strong>
                <span>{t("paymentLabel")}</span>
              </div>
              <div>
                <strong>24/7</strong>
                <span>{t("supportLabel")}</span>
              </div>
            </div>
          </div>
          <div className="hero-media">
            <img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80"
              alt="Featured meal"
            />
            <div className="hero-float-card">
              <span className="hero-float-icon">
                <Truck size={18} />
              </span>
              <div>
                <strong>{t("featureFastTitle")}</strong>
                <p className="muted">{t("featureFastText")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="section-heading">
          <h2>{t("categoriesTitle")}</h2>
          <NavLink className="text-link inline" to="/menu">
            {t("viewMenu")}
            <ArrowRight size={16} className={direction === "rtl" ? "flip-x" : ""} />
          </NavLink>
        </div>
        <div className="category-grid">
          {categories.map((item) => (
            <NavLink className="category-card" key={item} to={`/menu?category=${item}`}>
              <img src={categoryImages[item]} alt={t(item)} loading="lazy" />
              <span className="category-overlay" />
              <strong>{t(item)}</strong>
            </NavLink>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="section-heading">
          <h2>{t("popularMeals")}</h2>
          <NavLink className="text-link inline" to="/menu">
            {t("viewMenu")}
            <ArrowRight size={16} className={direction === "rtl" ? "flip-x" : ""} />
          </NavLink>
        </div>
        <div className="product-grid">
          {featured.map((product) => (
            <ProductCard product={product} key={product._id} />
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="section-heading center">
          <div>
            <h2>{t("whyTitle")}</h2>
            <p className="muted">{t("whySubtitle")}</p>
          </div>
        </div>
        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.title}>
              <span className="feature-icon">
                <feature.icon size={22} />
              </span>
              <h3>{feature.title}</h3>
              <p className="muted">{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-banner">
        <div className="cta-glow" aria-hidden="true" />
        <div className="cta-content">
          <h2>{t("ctaTitle")}</h2>
          <p>{t("ctaSubtitle")}</p>
          <NavLink className="button lg light" to="/menu">
            {t("startOrder")}
            <ArrowRight size={18} className={direction === "rtl" ? "flip-x" : ""} />
          </NavLink>
        </div>
      </section>
    </main>
  );
};

export default Home;
