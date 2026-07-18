import { useState } from "react";
import ProductModal from "../../../ProductModal/ProductModal";
import { Dialog } from "primereact/dialog";
import { useLanguage } from "../../../../contexts/LanguageContext";

const Product = ({ productData }) => {
    const [openProductDetails, setOpenProductDetails] = useState(false);
    const [visible, setVisible] = useState(false);
    const { language } = useLanguage();

    const addProduct = () => {
        setOpenProductDetails(true);
        setVisible(true);
    };

    const viewHandler = () => setOpenProductDetails((prev) => !prev);
    const price = productData.promo_price > 0 ? productData.promo_price : productData.price;

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

    return (
        <article className="ds-product-card">
            <a href={`/product/${productData.slug}`} className="ds-product-media">
                {productData.promo_price > 0 && <span className="ds-product-badge">Намаление</span>}
                {cardMediaIsVideo ? (
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        src={mediaUrl(cardMedia)}
                    >
                        Вашият браузър не поддържа видео елемента.
                    </video>
                ) : (
                    <img
                        src={mediaUrl(cardMedia)}
                        alt={productData.name[language]}
                    />
                )}
                <span className="ds-product-view">Разгледай</span>
            </a>
            <div className="ds-product-info">
                <div>
                    <p className="ds-product-category">Dark Society</p>
                    <h3>{productData.name[language]}</h3>
                </div>
                <div className="ds-product-price">
                    {productData.promo_price > 0 && <del>{Number(productData.price).toFixed(2)} €</del>}
                    <strong>{Number(price).toFixed(2)} €</strong>
                </div>
            </div>
            <button className="ds-quick-add" onClick={addProduct}>Бързо добавяне</button>

            {openProductDetails && (
                <Dialog visible={visible} onHide={() => setVisible(false)}>
                    <ProductModal productData={productData} modalHandler={viewHandler} />
                </Dialog>
            )}
        </article>
    );
};

export default Product;