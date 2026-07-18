import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { useCart } from "../../contexts/CartContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useTranslation } from "react-i18next";

const ProductModal = ({ productData, modalHandler }) => {
    const [selectedSize, setSelectedSize] = useState({ name: "", id: "", qty: 0 });
    const [count, setCount] = useState(1);
    const [errorHandler, setErrorHandler] = useState({ error: false, errorMessage: "" });
    const navigate = useNavigate();
    const modalRef = useRef(null);

    const { addToCart } = useCart();
    const { language } = useLanguage();
    const { t } = useTranslation();

    const options = productData?.options || [];
    const productName = typeof productData?.name === "object"
        ? productData?.name?.[language] || Object.values(productData?.name || {})[0]
        : productData?.name;

    const additionalMedia = (productData?.images || [])
        .map((item) =>
            typeof item === "string"
                ? item
                : item?.image_path || item?.image || item?.path
        )
        .filter(Boolean);

    const videoMedia = [
        productData?.video,
        productData?.video_path,
        productData?.image,
        productData?.image_path,
        ...additionalMedia,
    ].find((item) =>
        String(item || "").toLowerCase().split("?")[0].endsWith(".mp4")
    );

    const imageMedia = [
        productData?.image,
        productData?.image_path,
        ...additionalMedia,
    ].find((item) => item && !String(item).toLowerCase().split("?")[0].endsWith(".mp4"));

    const mediaUrl = (path) => {
        if (!path) return "/images/products/product-1.png";
        const normalized = String(path).replace(/\\/g, "/");

        if (
            normalized.startsWith("http://") ||
            normalized.startsWith("https://") ||
            normalized.startsWith("/storage/") ||
            normalized.startsWith("/images/")
        ) {
            return normalized;
        }

        if (normalized.startsWith("storage/")) return `/${normalized}`;
        return `/storage/${normalized.replace(/^public\//, "")}`;
    };

    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) modalHandler();
    };

    const handleOrderFinish = () => {
        toast.dismiss();
        navigate("/cart");
    };

    function addProductToCart() {
        if (selectedSize.name === "" && options.length > 0) {
            setErrorHandler({ error: true, errorMessage: t("Select size") });
            return;
        }

        addToCart(productData.id, count, selectedSize.id);
        toast.success(
            <div>
                <p>{`${productName} ${count}бр. ${selectedSize.name} ${t("add to cart")}.`}</p>
                <div className="flex justify-center">
                    <button onClick={handleOrderFinish} className="button-86">{t("Checkout")}</button>
                </div>
            </div>,
            { autoClose: 2000 }
        );
        setSelectedSize(false);
        setCount(1);
        modalHandler();
    }

    function addSize(name, id, qty) {
        setErrorHandler({ error: false, errorMessage: "" });
        if (selectedSize.qty > qty) setCount(qty);
        setSelectedSize({ name, id, qty });
    }

    function countHandler(action) {
        if (action === "increment") {
            setCount((previous) => previous + 1);
        } else if (action === "decrement" && count > 1) {
            setCount((previous) => previous - 1);
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 px-4 py-6 backdrop-blur-sm"
            onClick={handleClickOutside}
        >
            <motion.div
                ref={modalRef}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="relative max-h-[92vh] w-full max-w-5xl overflow-y-auto border border-white/20 bg-[#080808] shadow-[0_25px_100px_rgba(0,0,0,0.85)]"
            >
                <button
                    type="button"
                    aria-label="Затвори"
                    onClick={modalHandler}
                    className="absolute right-4 top-4 z-30 flex h-11 w-11 items-center justify-center border border-white/20 bg-black/70 text-2xl text-white transition hover:border-white hover:bg-white hover:text-black"
                >
                    ×
                </button>

                <div className="grid min-h-[620px] grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">
                    <a
                        href={`/product/${productData.slug}`}
                        className="relative flex min-h-[420px] items-center justify-center overflow-hidden bg-[#050505] lg:min-h-[620px]"
                    >
                        {videoMedia ? (
                            <video
                                className="h-full w-full object-cover"
                                src={mediaUrl(videoMedia)}
                                autoPlay
                                loop
                                muted
                                playsInline
                                preload="metadata"
                            >
                                Вашият браузър не поддържа видео елемента.
                            </video>
                        ) : (
                            <img
                                className="h-full w-full object-cover"
                                src={mediaUrl(imageMedia)}
                                alt={productName}
                            />
                        )}
                        <span className="absolute bottom-5 left-5 border border-white/20 bg-black/70 px-4 py-2 text-xs uppercase tracking-[0.22em] text-white backdrop-blur-sm">
                            Виж продукта
                        </span>
                    </a>

                    <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-12">
                        <p className="mb-3 text-xs uppercase tracking-[0.32em] text-white/40">Dark Society</p>
                        <h2 className="pr-12 text-3xl font-semibold uppercase leading-tight text-white md:text-4xl">{productName}</h2>

                        <div className="mt-6 border-y border-white/10 py-5">
                            {productData.promo_price > 0 ? (
                                <div className="flex items-end gap-4">
                                    <span className="text-lg text-white/35 line-through">{Number(productData.price).toFixed(2)} €</span>
                                    <span className="text-2xl font-semibold text-white">{Number(productData.promo_price).toFixed(2)} €</span>
                                </div>
                            ) : (
                                <span className="text-2xl font-semibold text-white">{Number(productData.price).toFixed(2)} €</span>
                            )}
                        </div>

                        {options.length > 0 && (
                            <div className="mt-7">
                                <div className="mb-3 flex items-center justify-between gap-4">
                                    <span className="text-sm uppercase tracking-[0.18em] text-white/55">{t("Size")}</span>
                                    {errorHandler.error && <span className="text-sm text-red-400">{errorHandler.errorMessage}</span>}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {options.map((option, index) => {
                                        const disabled = option.qty <= 0;
                                        const active = selectedSize.name === option.name;
                                        return (
                                            <button
                                                type="button"
                                                key={option.id || index}
                                                disabled={disabled}
                                                onClick={() => addSize(option.name, option.id, option.qty)}
                                                className={`min-w-14 border px-4 py-3 text-sm uppercase transition ${
                                                    disabled
                                                        ? "cursor-not-allowed border-white/10 text-white/20 line-through"
                                                        : active
                                                            ? "border-white bg-white text-black"
                                                            : "border-white/25 text-white hover:border-white"
                                                }`}
                                            >
                                                {option.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <div className="mt-7">
                            <span className="mb-3 block text-sm uppercase tracking-[0.18em] text-white/55">Количество</span>
                            <div className="inline-flex items-center border border-white/25">
                                <button type="button" onClick={() => countHandler("decrement")} className="h-12 w-12 text-xl text-white transition hover:bg-white hover:text-black">−</button>
                                <span className="flex h-12 min-w-14 items-center justify-center border-x border-white/25 text-base text-white">{count}</span>
                                <button type="button" onClick={() => countHandler("increment")} className="h-12 w-12 text-xl text-white transition hover:bg-white hover:text-black">+</button>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={addProductToCart}
                            className="mt-8 w-full border border-white bg-white px-6 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-black hover:text-white"
                        >
                            {t("Buy")}
                        </button>

                        <a
                            href={`/product/${productData.slug}`}
                            className="mt-5 text-center text-sm text-white/55 underline underline-offset-4 transition hover:text-white"
                        >
                            Прочети описанието
                        </a>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ProductModal;
