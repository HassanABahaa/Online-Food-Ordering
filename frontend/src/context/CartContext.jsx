import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { cartApi } from "../api/cart.api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);
const EMPTY_CART = { products: [], totalPrice: 0 };

const getCartKey = (user) => {
  if (!user) return "food_cart_guest";
  return `food_cart_${user._id || user.email}`;
};

const readLocalCart = (key) => {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : EMPTY_CART;
};

const saveLocalCart = (key, cart) => {
  localStorage.setItem(key, JSON.stringify(cart));
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
  const { token, user, isAdmin } = useAuth();
  const cartKey = getCartKey(user);
  const [cart, setCart] = useState(() => readLocalCart(cartKey));

  useEffect(() => {
    setCart(isAdmin ? EMPTY_CART : readLocalCart(cartKey));
  }, [cartKey, isAdmin]);

  const setAndSaveCart = (nextCart) => {
    if (isAdmin) {
      setCart(EMPTY_CART);
      return;
    }

    setCart(nextCart);
    saveLocalCart(cartKey, nextCart);
  };

  const loadCart = async () => {
    if (isAdmin) return EMPTY_CART;
    if (!token || token.startsWith("demo-")) return cart;

    try {
      const data = await cartApi.getCart();
      const nextCart = data.cart || EMPTY_CART;
      setAndSaveCart(nextCart);
      return nextCart;
    } catch (error) {
      return cart;
    }
  };

  const addProduct = async (product, quantity = 1) => {
    if (isAdmin) return EMPTY_CART;

    if (token && !token.startsWith("demo-")) {
      try {
        const data = await cartApi.addToCart({ productId: product._id, quantity });
        setAndSaveCart(data.cart);
        return data.cart;
      } catch (error) {
        // Fall back to local cart so the prototype stays usable while offline.
      }
    }

    const current = readLocalCart(cartKey);
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
    if (isAdmin) return EMPTY_CART;

    if (token && !token.startsWith("demo-")) {
      try {
        const data = await cartApi.updateCart({ productId, quantity });
        setAndSaveCart(data.cart);
        return data.cart;
      } catch (error) {
        // Local update follows.
      }
    }

    const current = readLocalCart(cartKey);
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
    if (isAdmin) return EMPTY_CART;

    if (token && !token.startsWith("demo-")) {
      try {
        const data = await cartApi.removeFromCart(productId);
        setAndSaveCart(data.cart);
        return data.cart;
      } catch (error) {
        // Local remove follows.
      }
    }

    const current = readLocalCart(cartKey);
    current.products = current.products.filter((item) => item.productId !== productId);
    current.totalPrice = calculateTotal(current.products);
    setAndSaveCart(current);
    return current;
  };

  const clearCart = async () => {
    if (isAdmin) return EMPTY_CART;

    if (token && !token.startsWith("demo-")) {
      try {
        const data = await cartApi.clearCart();
        setAndSaveCart(data.cart);
        return data.cart;
      } catch (error) {
        // Local clear follows.
      }
    }

    setAndSaveCart(EMPTY_CART);
    return EMPTY_CART;
  };

  const value = useMemo(
    () => ({
      cart,
      items: cart.products || [],
      totalPrice: cart.totalPrice || 0,
      itemsCount: isAdmin
        ? 0
        : (cart.products || []).reduce((count, item) => count + item.quantity, 0),
      loadCart,
      addProduct,
      updateQuantity,
      removeProduct,
      clearCart,
    }),
    [cart, token, cartKey, isAdmin],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);