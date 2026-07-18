import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";

import { useCart } from "../../contexts/CartContext";
import { useLanguage } from "../../contexts/LanguageContext";

import { useTranslation } from "react-i18next";
import parse from "html-react-parser";
import CountdownTimer from "../ProductsAndFilters/Products/CountdownTimer";

const ProductDetails = ({ productData, similarProducts }) => {
    const [selectedSize, setSelectedSize] = useState({
        name: "",
        id: "",
        qty: 0,
    });
    const [count, setCount] = useState(1);
    const [errorHandler, setErrorHandler] = useState({
        error: false,
        errorMessage: "",
    });
    const [mainImage, setMainImage] = useState(productData?.image);
    const [secondImages, setSecondImage] = useState([]);
    const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { language } = useLanguage();
    const { t } = useTranslation();

    useEffect(() => {
        setMainImage(productData?.image);

        const result =
            productData?.images
                ?.map((el) => el.image_path || el.image || el.path)
                .filter(Boolean) || [];

        setSecondImage(result);
    }, [productData]);

    useEffect(() => {
        if (!isFullscreenOpen) return undefined;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setIsFullscreenOpen(false);
            }
        };

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isFullscreenOpen]);

    function countHandler(action) {
        if (
            action === "increment" &&
            (count < selectedSize.qty || productData.qty > count)
        ) {
            setCount((prev) => ++prev);
        } else if (action === "decrement" && count > 1) {
            setCount((prev) => --prev);
        }
    }

    const handleOrderFinish = () => {
        toast.dismiss();
        navigate("/cart");
    };

    function addProductToCart() {
        if (selectedSize.name === "" && productData.options.length > 0) {
            setErrorHandler({
                error: true,
                errorMessage: t("Select size"),
            });
        } else {
            const isHave = productData.options.find(
                (el) => el.id === selectedSize.id
            );

            if (isHave?.qty > 0 || productData.qty > count) {
                addToCart(productData.id, count, selectedSize.id);
                toast.success(
                    <div>
                        <p>{`${productData.name[language]} ${count}бр. ${
                            selectedSize.name
                        } ${t("add to cart")}.`}</p>
                        <div className="flex justify-center">
                            <button
                                onClick={handleOrderFinish}
                                className="button-86"
                            >
                                {t("Checkout")}
                            </button>
                        </div>
                    </div>,
                    { autoClose: 2000 }
                );
                setSelectedSize(false);
                setCount(1);
            } else {
                setErrorHandler({
                    error: true,
                    errorMessage: t("Out of stock"),
                });
                toast.warning(
                    <div>
                        <p>{`${t("Out of stock")} ${
                            productData.name[language]
                        } ${t("Size")} ${selectedSize.name}.`}</p>
                        <div className="flex justify-center">
                            <button
                                onClick={handleOrderFinish}
                                className="button-86"
                            >
                                {t("Checkout")}
                            </button>
                        </div>
                    </div>
                );
            }
        }
    }

    function addSize(name, id, qty) {
        setErrorHandler({
            error: false,
            errorMessage: "",
        });

        if (selectedSize.qty > qty) {
            setCount(qty);
        }

        setSelectedSize({
            name,
            id,
            qty,
        });
    }

    function changeMainImage(imagePath) {
        setMainImage(imagePath);
    }

    const imageUrl = (path) => {
        if (!path) {
            return "/images/products/product-1.png";
        }

        const normalized = String(path).replace(/\\/g, "/");

        if (
            normalized.startsWith("http://") ||
            normalized.startsWith("https://") ||
            normalized.startsWith("/storage/") ||
            normalized.startsWith("/images/")
        ) {
            return normalized;
        }

        if (normalized.startsWith("storage/")) {
            return `/${normalized}`;
        }

        return `/storage/${normalized.replace(/^public\//, "")}`;
    };

    const productName =
        productData?.name?.[language] ||
        productData?.name?.bg ||
        Object.values(productData?.name || {})[0] ||
        "";

    const description = productData?.description?.[language];

    const hasPromo = Number(productData?.promo_price) > 0;
    const currentPrice = hasPromo
        ? Number(productData.promo_price)
        : Number(productData.price);

    const mainIsVideo = String(mainImage || "")
        .toLowerCase()
        .split("?")[0]
        .endsWith(".mp4");

    return (
        <main className="min-h-screen bg-[#050505] text-white">
            <section className="relative overflow-hidden border-b border-white/10 pt-24 md:pt-28">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_25%,rgba(255,255,255,0.06),transparent_34%)]" />

                <div className="pointer-events-none absolute right-[-2rem] top-20 select-none text-[8rem] font-black uppercase leading-none tracking-[-0.08em] text-white/[0.018] md:text-[15rem]">
                    DROP
                </div>

                <div className="relative z-10 mx-auto w-[92%] max-w-7xl py-10 md:py-16">
                    <span className="text-[10px] font-bold uppercase tracking-[0.26em] text-white/35">
                        Dark Society / Продукт
                    </span>

                    <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <h1 className="max-w-5xl text-[clamp(2.8rem,7vw,7rem)] font-black uppercase leading-[0.86] tracking-[-0.055em]">
                            {productName}
                        </h1>

                        <span className="shrink-0 text-xs font-bold uppercase tracking-[0.18em] text-white/35">
                            DROP 001
                        </span>
                    </div>
                </div>
            </section>

            <section className="py-10 md:py-16 lg:py-20">
                <div className="mx-auto grid w-[92%] max-w-7xl gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14 xl:gap-20">
                    <div className="min-w-0">
                        <div className="relative overflow-hidden border border-white/10 bg-[#0b0b0b]">
                            <span className="absolute left-5 top-5 z-10 border border-white/15 bg-black/55 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.18em] text-white/55 backdrop-blur-md">
                                DROP 001
                            </span>

                            <div className="flex aspect-[4/5] items-center justify-center overflow-hidden">
                                {mainIsVideo ? (
                                    <video
                                        className="h-full w-full object-cover"
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        preload="auto"
                                        controls
                                    >
                                        <source
                                            src={imageUrl(mainImage)}
                                            type="video/mp4"
                                        />
                                        Вашият браузър не поддържа видео елемента.
                                    </video>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setIsFullscreenOpen(true)}
                                        className="group h-full w-full cursor-zoom-in overflow-hidden"
                                        aria-label="Отвори снимката на цял екран"
                                    >
                                        <img
                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                                            src={imageUrl(mainImage)}
                                            alt={productName}
                                        />

                                        <span className="pointer-events-none absolute bottom-5 right-5 border border-white/20 bg-black/55 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.16em] text-white/65 backdrop-blur-md">
                                            Увеличи
                                        </span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {secondImages?.length > 0 && (
                            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:gap-4">
                                {secondImages.map((image, index) => {
                                    const isVideo = String(image)
                                        .toLowerCase()
                                        .split("?")[0]
                                        .endsWith(".mp4");

                                    return (
                                        <button
                                            key={`${image}-${index}`}
                                            type="button"
                                            onClick={() =>
                                                changeMainImage(image)
                                            }
                                            className={`relative aspect-square overflow-hidden border bg-[#0b0b0b] transition ${
                                                image === mainImage
                                                    ? "border-white"
                                                    : "border-white/10 hover:border-white/45"
                                            }`}
                                        >
                                            {isVideo ? (
                                                <>
                                                    <video
                                                        className="h-full w-full object-cover"
                                                        muted
                                                        playsInline
                                                    >
                                                        <source
                                                            src={imageUrl(image)}
                                                            type="video/mp4"
                                                        />
                                                    </video>

                                                    <span className="absolute inset-0 flex items-center justify-center bg-black/30 text-lg">
                                                        ▶
                                                    </span>
                                                </>
                                            ) : (
                                                <img
                                                    className="h-full w-full object-cover"
                                                    src={imageUrl(image)}
                                                    alt={`${productName} ${
                                                        index + 2
                                                    }`}
                                                />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <aside className="h-fit lg:sticky lg:top-28">
                        <div className="border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent p-6 md:p-9 lg:p-10">
                            <span className="mb-5 block text-[10px] font-bold uppercase tracking-[0.22em] text-white/35">
                                01 / Детайли
                            </span>

                            <h2 className="text-3xl font-black uppercase leading-[0.95] tracking-[-0.045em] md:text-5xl">
                                {productName}
                            </h2>

                            {productData?.active_promo_price && (
                                <div className="mt-6 border border-white/10 bg-white/[0.025] p-4">
                                    <CountdownTimer
                                        className="text-xl"
                                        dateTo={
                                            productData.active_promo_price.date_to
                                        }
                                    />
                                </div>
                            )}

                            <div className="mt-7 flex items-end justify-between gap-6 border-b border-white/10 pb-7">
                                <div>
                                    {hasPromo && (
                                        <span className="mb-1 block text-sm text-red-400 line-through">
                                            {Number(productData.price).toFixed(2)} €
                                        </span>
                                    )}

                                    <strong className="block text-2xl md:text-3xl">
                                        {Number(currentPrice).toFixed(2)} €
                                    </strong>
                                </div>

                                <span className="border border-white/15 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.16em] text-white/45">
                                    В наличност
                                </span>
                            </div>

                            {productData?.options?.length > 0 && (
                                <div className="mt-9">
                                    <div className="mb-4 flex items-center justify-between gap-4">
                                        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
                                            Избери размер
                                        </span>

                                        {selectedSize?.name && (
                                            <span className="text-xs font-bold uppercase tracking-[0.1em]">
                                                {selectedSize.name}
                                            </span>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-4 gap-3">
                                        {productData.options.map(
                                            (option, index) => {
                                                const selected =
                                                    selectedSize?.name ===
                                                    option.name;
                                                const available =
                                                    option.qty > 0;

                                                return (
                                                    <button
                                                        key={index}
                                                        type="button"
                                                        disabled={!available}
                                                        onClick={() =>
                                                            addSize(
                                                                option.name,
                                                                option.id,
                                                                option.qty
                                                            )
                                                        }
                                                        className={`min-h-12 border px-3 text-xs font-black uppercase tracking-[0.1em] transition ${
                                                            !available
                                                                ? "cursor-not-allowed border-red-500/35 text-red-400/40 line-through"
                                                                : selected
                                                                  ? "border-white bg-white text-black"
                                                                  : "border-white/15 text-white hover:border-white/50"
                                                        }`}
                                                    >
                                                        {option.name}
                                                    </button>
                                                );
                                            }
                                        )}
                                    </div>

                                    {errorHandler.error && (
                                        <p className="mt-4 text-xs font-bold uppercase tracking-[0.1em] text-red-400">
                                            {errorHandler.errorMessage}
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="mt-9">
                                <span className="mb-4 block text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
                                    Количество
                                </span>

                                <div className="inline-flex items-center border border-white/20">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            countHandler("decrement")
                                        }
                                        className="flex h-12 w-12 items-center justify-center text-xl transition hover:bg-white hover:text-black"
                                    >
                                        −
                                    </button>

                                    <span className="flex h-12 min-w-12 items-center justify-center border-x border-white/20 px-3 text-sm font-bold">
                                        {count}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            countHandler("increment")
                                        }
                                        className="flex h-12 w-12 items-center justify-center text-xl transition hover:bg-white hover:text-black"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={addProductToCart}
                                className="group mt-9 flex w-full items-center justify-between border border-white bg-white px-5 py-5 text-[11px] font-black uppercase tracking-[0.14em] text-black transition hover:-translate-y-0.5 hover:bg-transparent hover:text-white"
                            >
                                <span>Добави в количката</span>

                                <span className="text-base transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
                                    ↗
                                </span>
                            </button>

                            {description && (
                                <div className="mt-9 border-t border-white/10 pt-7">
                                    <span className="mb-4 block text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
                                        Описание
                                    </span>

                                    <div className="text-sm leading-7 text-white/55 [&_p]:mb-4 [&_strong]:text-white">
                                        {parse(description)}
                                    </div>
                                </div>
                            )}

                            <div className="mt-8 grid gap-5 border-t border-white/10 pt-7 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                                <div>
                                    <span className="block text-[9px] uppercase tracking-[0.15em] text-white/30">
                                        Доставка
                                    </span>
                                    <strong className="mt-2 block text-[11px] uppercase tracking-[0.08em] text-white/70">
                                        С Еконт
                                    </strong>
                                </div>

                                <div>
                                    <span className="block text-[9px] uppercase tracking-[0.15em] text-white/30">
                                        Плащане
                                    </span>
                                    <strong className="mt-2 block text-[11px] uppercase tracking-[0.08em] text-white/70">
                                        Карта или наложен платеж
                                    </strong>
                                </div>

                                <div>
                                    <span className="block text-[9px] uppercase tracking-[0.15em] text-white/30">
                                        Връщане
                                    </span>
                                    <strong className="mt-2 block text-[11px] uppercase tracking-[0.08em] text-white/70">
                                        Според общите условия
                                    </strong>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>

            {isFullscreenOpen &&
                createPortal(
                    <div
                        className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md sm:p-8"
                        onClick={() => setIsFullscreenOpen(false)}
                    >
                        <button
                            type="button"
                            onClick={() => setIsFullscreenOpen(false)}
                            className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center border border-white/20 bg-black/50 text-3xl text-white transition hover:border-white hover:bg-white hover:text-black sm:right-8 sm:top-8"
                            aria-label="Затвори"
                        >
                            ×
                        </button>

                        <div
                            className="flex h-full w-full items-center justify-center"
                            onClick={(event) => event.stopPropagation()}
                        >
                            <img
                                className="max-h-full max-w-full object-contain"
                                src={imageUrl(mainImage)}
                                alt={productName}
                            />
                        </div>
                    </div>,
                    document.body
                )}
        </main>
    );
};

export default ProductDetails;
