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
            {productData.image.endsWith(".mp4") ? (
                <div className="relative">
                    {loading && (
                        <div className="absolute inset-1 flex items-center justify-center bg-black bg-opacity-100">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-gray-900"></div>
                        </div>
                    )}
                    <video
                        className={`product-media transition-opacity duration-300 ${
                            loading ? "opacity-0" : "opacity-100"
                        }`}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                        onLoadedData={() => setLoading(false)}
                    >
                        <source src={`${productData.image_path}`} type="video/mp4" />
                        Вашият браузър не поддържа видео елемента.
                    </video>
                </div>
            ) : (
                <img
                    className="product-media"
                    src={`/storage/${productData.image}`}
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
