import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { toast } from "react-toastify";

import * as cartService from "../services/cartService";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({
        cart_items: [],
        total: 0,
    });

    const cartCount = useMemo(() => {
        return (
            cart?.cart_items?.reduce(
                (total, item) => total + Number(item.quantity || 0),
                0
            ) || 0
        );
    }, [cart]);

    useEffect(() => {
        cartService.getCart().then((result) => {
            if (result.success) {
                setCart(
                    result.cart || {
                        cart_items: [],
                        total: 0,
                    }
                );
            }
        });
    }, []);

    const resetCart = () => {
        setCart({
            cart_items: [],
            total: 0,
        });
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
            .catch(() => {
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
            .catch(() => {
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
            .catch(() => {
                toast.error("Неуспешно обновяване.");
            });
    };

    const applyCoupon = (coupon) => {
        cartService
            .addCoupon({ coupon })
            .then((res) => {
                if (res.success) {
                    setCart(res.cart);
                    toast.success("Купонът е приложен успешно!");
                } else {
                    toast.error(res.message);
                }
            })
            .catch(() => {
                toast.error("Неуспешно добавяне на купон.");
            });
    };

    const removeCoupon = () => {
        cartService
            .removeCoupon()
            .then((res) => {
                if (res.success) {
                    setCart(res.cart);
                    toast.success("Купонът е премахнат успешно!");
                } else {
                    toast.error(res.message);
                }
            })
            .catch(() => {
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

export const useCart = () => useContext(CartContext);