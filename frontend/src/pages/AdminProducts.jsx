import { Edit3, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { adminApi } from "../api/admin.api";
import { categories, demoProducts } from "../data/demoData";
import { useLanguage } from "../context/LanguageContext";

const emptyForm = {
  name: { en: "", ar: "" },
  description: { en: "", ar: "" },
  image: "",
  price: "",
  category: "pizza",
  available: true,
};

const AdminProducts = () => {
  const { language, t } = useLanguage();
  const [products, setProducts] = useState(demoProducts);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [notice, setNotice] = useState("");

  const loadProducts = async () => {
    try {
      const data = await adminApi.getProducts();
      setProducts(data.products || []);
      setNotice("");
    } catch (error) {
      setProducts(JSON.parse(localStorage.getItem("food_admin_products") || "null") || demoProducts);
      setNotice(t("apiOffline"));
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const saveLocalProducts = (nextProducts) => {
    localStorage.setItem("food_admin_products", JSON.stringify(nextProducts));
    setProducts(nextProducts);
  };

  const updateNested = (field, lang, value) => {
    setForm((current) => ({
      ...current,
      [field]: {
        ...current[field],
        [lang]: value,
      },
    }));
  };

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const editProduct = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      image: product.image,
      price: product.price,
      category: product.category,
      available: product.available,
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = { ...form, price: Number(form.price) };

    try {
      if (editingId) {
        const data = await adminApi.updateProduct(editingId, payload);
        setProducts((current) =>
          current.map((product) => (product._id === editingId ? data.product : product)),
        );
      } else {
        const data = await adminApi.createProduct(payload);
        setProducts((current) => [data.product, ...current]);
      }
      setNotice("");
      resetForm();
    } catch (error) {
      const localProduct = {
        ...payload,
        _id: editingId || `local-product-${Date.now()}`,
      };
      const nextProducts = editingId
        ? products.map((product) => (product._id === editingId ? localProduct : product))
        : [localProduct, ...products];
      saveLocalProducts(nextProducts);
      setNotice(t("apiOffline"));
      resetForm();
    }
  };

  const deleteProduct = async (id) => {
    try {
      await adminApi.deleteProduct(id);
      setProducts((current) => current.filter((product) => product._id !== id));
    } catch (error) {
      saveLocalProducts(products.filter((product) => product._id !== id));
      setNotice(t("apiOffline"));
    }
  };

  return (
    <main className="page-shell admin-grid">
      <section className="content-panel">
        <div className="section-heading">
          <h1>{t("products")}</h1>
        </div>
        {notice && <p className="notice">{notice}</p>}
        <div className="admin-product-list">
          {products.map((product) => (
            <article className="admin-product-row" key={product._id}>
              <img src={product.image} alt={product.name[language]} />
              <div>
                <h3>{product.name[language]}</h3>
                <p className="muted">{t(product.category)} - {product.price} EGP</p>
              </div>
              <span className={`status-pill ${product.available ? "ok" : "off"}`}>
                {product.available ? t("available") : t("unavailable")}
              </span>
              <button className="icon-button" type="button" onClick={() => editProduct(product)}>
                <Edit3 size={17} />
              </button>
              <button className="icon-button danger" type="button" onClick={() => deleteProduct(product._id)}>
                <Trash2 size={17} />
              </button>
            </article>
          ))}
        </div>
      </section>

      <form className="form-panel product-form" onSubmit={handleSubmit}>
        <h2>{editingId ? t("updateProduct") : t("createProduct")}</h2>
        <label>
          <span>{t("englishName")}</span>
          <input value={form.name.en} onChange={(event) => updateNested("name", "en", event.target.value)} required />
        </label>
        <label>
          <span>{t("arabicName")}</span>
          <input value={form.name.ar} onChange={(event) => updateNested("name", "ar", event.target.value)} required />
        </label>
        <label>
          <span>{t("englishDescription")}</span>
          <textarea value={form.description.en} onChange={(event) => updateNested("description", "en", event.target.value)} required />
        </label>
        <label>
          <span>{t("arabicDescription")}</span>
          <textarea value={form.description.ar} onChange={(event) => updateNested("description", "ar", event.target.value)} required />
        </label>
        <label>
          <span>{t("imageUrl")}</span>
          <input value={form.image} onChange={(event) => updateField("image", event.target.value)} required />
        </label>
        <div className="form-split">
          <label>
            <span>{t("price")}</span>
            <input type="number" value={form.price} onChange={(event) => updateField("price", event.target.value)} required />
          </label>
          <label>
            <span>{t("category")}</span>
            <select value={form.category} onChange={(event) => updateField("category", event.target.value)}>
              {categories.map((item) => (
                <option value={item} key={item}>{t(item)}</option>
              ))}
            </select>
          </label>
        </div>
        <label className="check-row">
          <input
            type="checkbox"
            checked={form.available}
            onChange={(event) => updateField("available", event.target.checked)}
          />
          <span>{t("available")}</span>
        </label>
        <button className="button full" type="submit">
          {editingId ? <Save size={18} /> : <Plus size={18} />}
          <span>{editingId ? t("save") : t("createProduct")}</span>
        </button>
        {editingId && (
          <button className="button ghost full" type="button" onClick={resetForm}>
            {t("cancel")}
          </button>
        )}
      </form>
    </main>
  );
};

export default AdminProducts;
