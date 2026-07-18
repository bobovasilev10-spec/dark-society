import React, { createContext, useState, useContext, useEffect } from "react";
import * as cartService from "../services/cartService";
import { toast } from "react-toastify";

// Create the context
const WishListContext = createContext();

// Provider component
export const WishListProvider = ({ children }) => {
    const [wishList, setWishlist] = useState(() => {
        // Get initial wishlist state from localStorage
        const savedWishlist = localStorage.getItem("wishlist");
        return savedWishlist ? JSON.parse(savedWishlist) : [];
    });
    const [wishListCount, setWishListCount] = useState(() => {
        const savedWishCount = localStorage.getItem("wishCount");
        return savedWishCount ? JSON.parse(savedWishCount) : 0;
    });

    useEffect(() => {
        // Update wishlist count whenever wishlist changes
        setWishListCount(wishList?.length);
        localStorage.setItem("wishCount", JSON.stringify(wishList?.length));
    }, [wishList]);

    const removeFromWishlist = (id) => {
        let updatedWishlist = wishList.filter((item) => item.id !== id);
        setWishlist(updatedWishlist);
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    };

    const addToWishlist = (product) => {
        const existingItem = wishList.find((item) => item.id === product.id);
        if (!existingItem) {
            const updatedWishlist = [...wishList, product];
            setWishlist((state) => updatedWishlist);
            localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
        } else {
            toast.error("Този продукт вече е добавен в любими");
        }
    };

    return (
        <WishListContext.Provider
            value={{
                wishList,
                removeFromWishlist,
                addToWishlist,
                wishListCount,
            }}
        >
            {children}
        </WishListContext.Provider>
    );
};

// Custom hook to use the cart context
export const useWishList = () => useContext(WishListContext);
