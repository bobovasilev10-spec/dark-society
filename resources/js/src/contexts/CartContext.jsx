import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";

import * as cartService from "../services/cartService";

// Create the context
const CartContext = createContext();

// Provider component
export const CartProvider = ({ children }) => {
    const [recalcCount, setRecalcCount] = useState(false);
    const [cart, setCart] = useState(() => {
        [];
    });

    const [cartCount, setCartCount] = useState(0);
    useEffect(() => {
        setCartCount(cart?.cart_items?.length);
    }, [recalcCount]);

    useEffect(() => {
        cartService.getCart().then((result) => {
            if (result.success) {
                setCart(result.cart);
                setCartCount(result.cart?.cart_items?.length);
            }
        });
        // Update cart count whenever cart changes
    }, []);

    useEffect(() => {});

    const resetCart = () => {
        setCart([]);
        setCartCount(0);
        localStorage.removeItem("cart");
    };

    const addToCart = (id, qty, selectedSize, subscription_id) => {
        const requestData = {
            product_id: id,
            quantity: qty,
            option_id: selectedSize,
            subscription_id,
        };
        cartService
            .addToCart(requestData)
            .then((result) => {
                if (result.success) {
                    setRecalcCount((state) => !state);
                    setCart(result.cart);
                } else {
                    Object.entries(result).forEach(([field, errors]) => {
                        if (Array.isArray(errors)) {
                            errors.forEach((err) => {
                                toast.error(err);
                            });
                        } else {
                            toast.error(errors);
                        }
                    });
                }
            })
            .catch((error) => {
                toast.error("Неуспешно добавяне.");
            });
    };

    const removeFromCart = (id) => {
        const requestData = {
            cart_item_id: id,
        };

        cartService
            .removeFromCart(requestData)
            .then((result) => {
                if (result.success) {
                    toast.success("Продуктът беше премахнат успешно");
                    setCart(result.cart);
                    setRecalcCount((state) => !state);
                } else {
                    Object.entries(result).forEach(([field, errors]) => {
                        if (Array.isArray(errors)) {
                            errors.forEach((err) => {
                                toast.error(err);
                            });
                        } else {
                            toast.error(errors);
                        }
                    });
                }
            })
            .catch((error) => {
                toast.error("Неуспешно премахване.");
            });
    };

    const updateCartItem = (id, qty) => {
        const requestData = {
            cart_item_id: id,
            quantity: qty,
        };

        cartService
            .updateCart(requestData)
            .then((result) => {
                if (result.success) {
                    toast.success("Количката беше обновена");
                    setCart(result.cart);
                    setRecalcCount((state) => !state);
                } else {
                    Object.entries(result).forEach(([field, errors]) => {
                        if (Array.isArray(errors)) {
                            errors.forEach((err) => {
                                toast.error(err);
                            });
                        } else {
                            toast.error(errors);
                        }
                    });
                }
            })
            .catch((error) => {
                toast.error("Неуспешно обновяване.");
            });
    };

    const applyCoupon = (coupon) => {
        cartService
            .addCoupon({ coupon })
            .then((res) => {
                if (res.success) {
                    setCart(res.cart);
                    toast.success("Купона е приложен успешно!");
                } else {
                    toast.error(res.message);
                }
            })
            .catch((error) => {
                toast.error("Неуспешно добавяне на купон.");
            });
    };
    const removeCoupon = () => {
        cartService
            .removeCoupon()
            .then((res) => {
                if (res.success) {
                    setCart(res.cart);
                    toast.success("Купона е премахнат успешно!");
                } else {
                    toast.error(res.message);
                }
            })
            .catch((error) => {
                toast.error("Неуспешно премахване на купон.");
            });
    };
    return (
        <CartContext.Provider
            value={{
                cart,
                cartCount,
                addToCart,
                removeFromCart,
                updateCartItem,
                resetCart,
                applyCoupon,
                removeCoupon,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext);
