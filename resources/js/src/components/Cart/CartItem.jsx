import { useTranslation } from "react-i18next";
import { useCart } from "../../contexts/CartContext";
import { useLanguage } from "../../contexts/LanguageContext";

const CartItem = ({ cartItem }) => {
    const { removeFromCart, updateCartItem } = useCart();
    const product = cartItem.product
        ? cartItem.product
        : cartItem.subscription;

    const { language } = useLanguage();
    const { t } = useTranslation();
    function removeItem() {
        removeFromCart(cartItem.id);
    }

    function countHandler(action) {
        if (action === "decrement" && cartItem.quantity > 1) {
            updateCartItem(cartItem.id, --cartItem.quantity);
        } else if (action === "increment") {
            updateCartItem(cartItem.id, ++cartItem.quantity);
        }
    }

    const currentPrice =
        cartItem?.product?.promo_price > 0
            ? cartItem.product.promo_price
            : cartItem?.product?.price ??
              (cartItem?.subscription?.promo_price > 0
                  ? cartItem.subscription.promo_price
                  : cartItem?.subscription?.price);

    const oldPrice =
        cartItem?.product?.promo_price > 0
            ? cartItem.product.price
            : cartItem?.subscription?.promo_price > 0
              ? cartItem.subscription.price
              : null;

    return (
        <li className="border-b border-white/10 py-5 last:border-b-0">
            <div className="grid grid-cols-[88px_1fr] gap-4 sm:grid-cols-[104px_1fr]">
                <a
                    href={
                        product?.description
                            ? `/product/${product.slug}`
                            : `/subscription/${product.slug}`
                    }
                    className="block overflow-hidden bg-white/[0.03]"
                >
                    {(() => {
                        const media =
                            product.video ||
                            product.video_path ||
                            product.image ||
                            product.image_path;

                        const normalized = String(media || "").replace(/\\/g, "/");

                        const mediaUrl =
                            normalized.startsWith("http://") ||
                            normalized.startsWith("https://") ||
                            normalized.startsWith("/storage/") ||
                            normalized.startsWith("/images/")
                                ? normalized
                                : `/storage/${normalized.replace(/^public\//, "")}`;

                        const isVideo = normalized
                            .toLowerCase()
                            .split("?")[0]
                            .endsWith(".mp4");

                        return isVideo ? (
                            <video
                                className="h-[112px] w-full object-cover sm:h-[128px]"
                                src={mediaUrl}
                                autoPlay
                                loop
                                muted
                                playsInline
                                preload="metadata"
                            />
                        ) : (
                            <img
                                className="h-[112px] w-full object-cover sm:h-[128px]"
                                src={mediaUrl}
                                alt={product.name?.[language] || "Продукт"}
                            />
                        );
                    })()}
                </a>

                <div className="flex min-w-0 flex-col justify-between">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <a
                                href={
                                    product?.description
                                        ? `/product/${product.slug}`
                                        : `/subscription/${product.slug}`
                                }
                                className="line-clamp-2 text-sm font-bold uppercase tracking-[0.06em] text-white transition hover:text-white/60 sm:text-base"
                            >
                                {product?.name?.[language]}
                            </a>

                            {cartItem?.options?.map((option, index) => (
                                <p
                                    key={index}
                                    className="mt-2 text-[11px] uppercase tracking-[0.12em] text-white/40"
                                >
                                    {option.option.name?.[language]}:{" "}
                                    <span className="text-white/75">
                                        {option.name}
                                    </span>
                                </p>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={removeItem}
                            aria-label={t("Премахни")}
                            className="shrink-0 text-xl leading-none text-white/35 transition hover:scale-110 hover:text-red-500"
                        >
                            ×
                        </button>
                    </div>

                    <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div className="inline-flex w-fit items-center border border-white/20">
                            <button
                                type="button"
                                onClick={() => countHandler("decrement")}
                                className="flex h-9 w-9 items-center justify-center text-lg text-white transition hover:bg-white hover:text-black"
                            >
                                −
                            </button>

                            <span className="flex h-9 min-w-10 items-center justify-center border-x border-white/20 px-2 text-sm font-semibold">
                                {cartItem.quantity}
                            </span>

                            <button
                                type="button"
                                onClick={() => countHandler("increment")}
                                className="flex h-9 w-9 items-center justify-center text-lg text-white transition hover:bg-white hover:text-black"
                            >
                                +
                            </button>
                        </div>

                        <div className="text-left sm:text-right">
                            {oldPrice && (
                                <span className="block text-xs text-red-400 line-through">
                                    {Number(oldPrice).toFixed(2)} €
                                </span>
                            )}

                            <strong className="mt-1 block text-sm text-white sm:text-base">
                                {Number(currentPrice).toFixed(2)} €
                            </strong>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    );
};

export default CartItem;
