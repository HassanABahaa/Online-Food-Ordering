import { createContext, useContext, useMemo, useState } from "react";
import { cartApi } from "../api/cart.api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);
const CART_KEY = "food_cart";

const readLocalCart = () => {
  const saved = localStorage.getItem(CART_KEY);
  return saved ? JSON.parse(saved) : { products: [], totalPrice: 0 };
};

const saveLocalCart = (cart) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

const calculateTotal = (products) => {
  return products.reduce((total, item) => total + item.totalPrice, 0);
};

const productToCartItem = (product, quantity) => ({
  productId: product._id,
  quantity,
  name: product.name,
  image: product.image,
  itemPrice: product.price,
  totalPrice: product.price * quantity,
});

export const CartProvider = ({ children }) => {
  const { token } = useAuth();
  const [cart, setCart] = useState(readLocalCart);

  const setAndSaveCart = (nextCart) => {
    setCart(nextCart);
    saveLocalCart(nextCart);
  };

  const loadCart = async () => {
    if (!token || token.startsWith("demo-")) return cart;

    try {
      const data = await cartApi.getCart();
      const nextCart = data.cart || { products: [], totalPrice: 0 };
      setAndSaveCart(nextCart);
      return nextCart;
    } catch (error) {
      return cart;
    }
  };

  const addProduct = async (product, quantity = 1) => {
    if (token && !token.startsWith("demo-")) {
      try {
        const data = await cartApi.addToCart({ productId: product._id, quantity });
        setAndSaveCart(data.cart);
        return data.cart;
      } catch (error) {
        // Fall back to local cart so the prototype stays usable while offline.
      }
    }

    const current = readLocalCart();
    const index = current.products.findIndex((item) => item.productId === product._id);

    if (index > -1) {
      current.products[index].quantity += quantity;
      current.products[index].totalPrice =
        current.products[index].itemPrice * current.products[index].quantity;
    } else {
      current.products.push(productToCartItem(product, quantity));
    }

    current.totalPrice = calculateTotal(current.products);
    setAndSaveCart(current);
    return current;
  };

  const updateQuantity = async (productId, quantity) => {
    if (token && !token.startsWith("demo-")) {
      try {
        const data = await cartApi.updateCart({ productId, quantity });
        setAndSaveCart(data.cart);
        return data.cart;
      } catch (error) {
        // Local update follows.
      }
    }

    const current = readLocalCart();
    current.products = current.products.map((item) =>
      item.productId === productId
        ? { ...item, quantity, totalPrice: item.itemPrice * quantity }
        : item,
    );
    current.totalPrice = calculateTotal(current.products);
    setAndSaveCart(current);
    return current;
  };

  const removeProduct = async (productId) => {
    if (token && !token.startsWith("demo-")) {
      try {
        const data = await cartApi.removeFromCart(productId);
        setAndSaveCart(data.cart);
        return data.cart;
      } catch (error) {
        // Local remove follows.
      }
    }

    const current = readLocalCart();
    current.products = current.products.filter((item) => item.productId !== productId);
    current.totalPrice = calculateTotal(current.products);
    setAndSaveCart(current);
    return current;
  };

  const clearCart = async () => {
    if (token && !token.startsWith("demo-")) {
      try {
        const data = await cartApi.clearCart();
        setAndSaveCart(data.cart);
        return data.cart;
      } catch (error) {
        // Local clear follows.
      }
    }

    const empty = { products: [], totalPrice: 0 };
    setAndSaveCart(empty);
    return empty;
  };

  const value = useMemo(
    () => ({
      cart,
      items: cart.products || [],
      totalPrice: cart.totalPrice || 0,
      itemsCount: (cart.products || []).reduce((count, item) => count + item.quantity, 0),
      loadCart,
      addProduct,
      updateQuantity,
      removeProduct,
      clearCart,
    }),
    [cart, token],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
