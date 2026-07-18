import { motion } from "framer-motion";
import { useRef } from "react";
import { createPortal } from "react-dom";
import { useCart } from "../../contexts/CartContext";
import CartItem from "./CartItem";
import { useTranslation } from "react-i18next";

const CartModal = ({ handleClickOutside }) => {
    const modalRef = useRef(null);

    const { cart, cartCount } = useCart();
    const { t } = useTranslation();
    const viewHandler = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            handleClickOutside();
        }
    };

    return createPortal(
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9999] overflow-y-auto bg-black/85 px-3 py-6 backdrop-blur-sm sm:px-6 sm:py-10"
            onClick={viewHandler}
        >
            <motion.div
                ref={modalRef}
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 18, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="relative mx-auto flex min-h-0 w-full max-w-6xl flex-col overflow-hidden border border-white/15 bg-[#050505] shadow-[0_35px_120px_rgba(0,0,0,0.75)]"
            >
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-5 sm:px-7">
                    <div>
                        <span className="mb-2 block text-[10px] uppercase tracking-[0.22em] text-white/35">
                            Dark Society / {t("Количка")}
                        </span>

                        <h2 className="text-2xl font-black uppercase tracking-[-0.04em] text-white sm:text-3xl">
                            {t("Твоята количка")}
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={handleClickOutside}
                        aria-label={t("Затвори")}
                        className="flex h-11 w-11 items-center justify-center border border-white/15 text-2xl text-white/60 transition hover:border-white hover:bg-white hover:text-black"
                    >
                        ×
                    </button>
                </div>

                <div className="grid min-h-0 flex-1 lg:grid-cols-[1fr_360px]">
                    <section className="min-h-0 overflow-hidden border-b border-white/10 lg:border-b-0 lg:border-r">
                        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-7">
                            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-white/50">
                                {t("Продукти")}
                            </h3>

                            <span className="text-xs text-white/35">
                                {cartCount} {t("продукта")}
                            </span>
                        </div>

                        <div className="max-h-[50vh] overflow-y-auto px-5 sm:px-7 lg:max-h-[58vh]">
                            {cart.cart_items.length > 0 ? (
                                <ul>
                                    {cart.cart_items.map((item, index) => (
                                        <CartItem
                                            key={index}
                                            cartItem={item}
                                        />
                                    ))}
                                </ul>
                            ) : (
                                <div className="flex min-h-[260px] items-center justify-center text-sm uppercase tracking-[0.12em] text-white/35">
                                    {t("Количката е празна")}
                                </div>
                            )}
                        </div>
                    </section>

                    <aside className="flex flex-col bg-white/[0.02] p-5 sm:p-7">
                        <div>
                            <span className="mb-3 block text-[10px] uppercase tracking-[0.2em] text-white/35">
                                02
                            </span>

                            <h3 className="text-2xl font-black uppercase tracking-[-0.04em] text-white">
                                {t("Обобщение")}
                            </h3>
                        </div>

                        <div className="mt-8 space-y-5 border-t border-white/10 pt-6">
                            <div className="flex items-start justify-between gap-5 text-sm">
                                <span className="text-white/45">
                                    {t("Брой продукти")}
                                </span>
                                <strong>{cartCount}</strong>
                            </div>

                            <div className="flex items-start justify-between gap-5 text-sm">
                                <span className="text-white/45">
                                    {t("Междинна сума")}
                                </span>

                                <div className="text-right">
                                    <strong className="block">
                                        {Number(cart.total).toFixed(2)} €
                                    </strong>
                                    <span className="text-xs text-white/30">
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-start justify-between gap-5 text-sm">
                                <span className="text-white/45">
                                    {t("Доставка")}
                                </span>
                                <span className="text-right text-white/60">
                                    {t("Изчислява се при поръчка")}
                                </span>
                            </div>
                        </div>

                        <div className="mt-8 border-t border-white/10 pt-6">
                            <div className="flex items-end justify-between gap-5">
                                <span className="text-sm font-bold uppercase tracking-[0.12em]">
                                    {t("Общо")}
                                </span>

                                <div className="text-right">
                                    <strong className="block text-2xl">
                                        {Number(cart.total).toFixed(2)} €
                                    </strong>
                                    <span className="text-xs text-white/35">
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto pt-8">
                            <a
                                href="/cart"
                                className="group flex w-full items-center justify-between border border-white bg-white px-5 py-4 text-[11px] font-black uppercase tracking-[0.14em] text-black transition hover:-translate-y-0.5 hover:bg-transparent hover:text-white"
                            >
                                <span>{t("Към завършване")}</span>
                                <span className="text-base transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
                                    ↗
                                </span>
                            </a>

                            <button
                                type="button"
                                onClick={handleClickOutside}
                                className="mt-3 w-full py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-white/35 transition hover:text-white"
                            >
                                {t("Продължи пазаруването")}
                            </button>
                        </div>
                    </aside>
                </div>
            </motion.div>
        </motion.div>,
        document.body
    );
};

export default CartModal;