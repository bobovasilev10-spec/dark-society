"use client";
import { useState } from "react";
import { Dialog } from "primereact/dialog";

import ProductModal from "../../ProductModal/ProductModal";
import { useLanguage } from "../../../contexts/LanguageContext";
import { useTranslation } from "react-i18next";
import CountdownTimer from "./CountdownTimer";



const Slide = ({ productData }) => {
    const [isHover, setIsHover] = useState(false);
    const [openProductDetails, setOpenProductDetails] = useState(false);
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const { language } = useLanguage();
    const { t } = useTranslation();

    const additionalMedia =
        productData?.images
            ?.map((item) =>
                typeof item === "string"
                    ? item
                    : item?.image_path || item?.image || item?.path
            )
            .filter(Boolean) || [];

    const videoMedia = [
        productData?.video,
        productData?.video_path,
        productData?.image,
        productData?.image_path,
        ...additionalMedia,
    ].find((item) =>
        String(item || "")
            .toLowerCase()
            .split("?")[0]
            .endsWith(".mp4")
    );

    const cardMedia = videoMedia || productData?.image;
    const cardMediaIsVideo = Boolean(videoMedia);

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

        if (normalized.startsWith("storage/")) {
            return `/${normalized}`;
        }

        return `/storage/${normalized.replace(/^public\//, "")}`;
    };
    function addProduct() {
        setOpenProductDetails(true);
        setVisible(true);
    }

    function viewHandler() {
        setOpenProductDetails((prev) => (prev = !prev));
    }


    return (
        <div
            className="product-card"
            onMouseEnter={() => setIsHover((prev) => (prev = !prev))}
            onMouseLeave={() => setIsHover((prev) => (prev = !prev))}
        >
            {openProductDetails && (
                <Dialog
                    visible={visible}
                    onHide={() => {
                        if (!visible) return;
                        setVisible(false);
                    }}
                >
                    <ProductModal
                        productData={productData}
                        modalHandler={viewHandler}
                    />
                </Dialog>
            )}

            <a
    href={`/product/${productData.slug}`}
    className="product-image"
>
            {cardMediaIsVideo ? (
                <div className="relative h-full w-full overflow-hidden">
                    {loading && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
                            <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
                        </div>
                    )}

                    <video
                        className={`product-media h-full w-full object-cover transition-opacity duration-300 ${
                            loading ? "opacity-0" : "opacity-100"
                        }`}
                        src={mediaUrl(cardMedia)}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        onLoadedData={() => setLoading(false)}
                        onCanPlay={() => setLoading(false)}
                    >
                        Вашият браузър не поддържа видео елемента.
                    </video>
                </div>
            ) : (
                <img
                    className="product-media"
                    src={mediaUrl(cardMedia)}
                    alt={productData.name[language]}
                />
            )}
        </a>

            <div className="product-info">
                <h3 className="product-title">
                    {productData.name[language]}
                </h3>

                <div className="text-sm">
                    {productData?.active_promo_price && (
                        <CountdownTimer
                            dateTo={productData?.active_promo_price.date_to}
                        />
                    )}
                </div>

                {productData.promo_price > 0 ? (
                    <div className="product-price">
                        <span className="text-center line-through decoration-red-700 text-red-700 text-lg">
                            {t("Price")}: {Number(productData.price).toFixed(2)} €
                        </span>
                        <span className="text-white text-center text-lg">
                            {t("Price")}: {Number(productData.promo_price).toFixed(2)} €
                        </span>
                        <span className="text-center text-lg text-gray-400">
                            
                        </span>
                    </div>
                ) : (
                    <div className="product-price">
                        <p className="text-white text-center text-lg">
                            {t("Price")}: {Number(productData.price).toFixed(2)} €
                        </p>
                        <span className="text-center text-lg text-gray-400">
                            
                        </span>
                    </div>
                )}
                <div className="product-actions">
                    <button
                        className="product-button"
                        onClick={addProduct}
                    >
                        <span>
                            <i
                                className="fa-solid fa-cart-shopping"
                                style={{ fontSize: "24px" }}
                            ></i>
                        </span>
                        <span className="text-xl">{t("Buy")}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Slide;
