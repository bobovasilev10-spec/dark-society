import { useState } from "react";
import { motion } from "framer-motion";

import CartModal from "../Cart/CartModal";
import SearchModal from "./SearchModal/SearchModal";
import HamburgerMenu from "./HamburgerMenu/HamburgerMenu";
import { useCart } from "../../contexts/CartContext";

import "./Header.css";

export default function Header({ new_products, categories }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchModal, setSearchModal] = useState(false);
    const [cartViewHandler, setCartViewHandler] = useState(false);
    const { cart } = useCart();

    const cartCount =
        cart?.cart_items?.reduce(
            (total, item) => total + Number(item.quantity || 0),
            0
        ) || 0;

    const handleClickOutside = (action) => {
        action === "search"
            ? setSearchModal((prev) => !prev)
            : setCartViewHandler((prev) => !prev);
    };

    const hanburgerMenuHandler = () => setIsMenuOpen((prev) => !prev);

    return (
        <motion.header
            initial={{ y: -90 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="ds-header"
        >
            

            <div className="ds-header-inner">
                <a href="/" className="ds-brand" aria-label="Dark Society начало">
                    
                    <span className="ds-brand-name">DARK SOCIETY</span>
                </a>

                <nav className="ds-nav" aria-label="Основна навигация">
                    <a href="/">Начало</a>
                    <a href="/category/teniski">Магазин</a>
                    <a href="/about-us">За бранда</a>
                    <a href="/contact">Контакти</a>
                </nav>

                <div className="ds-actions">
                    <button
                        className="ds-icon-button ds-search-button"
                        onClick={() => setSearchModal((prev) => !prev)}
                        aria-label="Търсене"
                    >
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </button>

                    <button
                        className="ds-icon-button ds-cart-button"
                        onClick={() => setCartViewHandler((prev) => !prev)}
                        aria-label="Количка"
                    >
                        <i className="fa-solid fa-bag-shopping"></i>
                        {cartCount > 0 && (
                            <span className="ds-cart-count">
                                {cartCount > 99 ? "99+" : cartCount}
                            </span>
                        )}
                    </button>

                    <button
                        className="ds-icon-button ds-menu-button"
                        onClick={hanburgerMenuHandler}
                        aria-label="Меню"
                    >
                        <i className="fa-solid fa-bars"></i>
                    </button>
                </div>
            </div>

            {cartViewHandler && (
                <CartModal handleClickOutside={handleClickOutside} />
            )}

            {searchModal && (
                <SearchModal
                    handleClickOutside={handleClickOutside}
                    new_products={new_products}
                />
            )}

            {isMenuOpen && (
                <HamburgerMenu
                    hanburgerMenuHandler={hanburgerMenuHandler}
                    categories={categories}
                />
            )}
        </motion.header>
    );
}