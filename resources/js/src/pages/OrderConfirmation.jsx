import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCart } from "../contexts/CartContext";
import { formatDateTime } from "../utils";
import { useLanguage } from "../contexts/LanguageContext";
import Loader from "../components/utils/Loader";

export default function OrderConfirmation() {
    const { t } = useTranslation();
    const { cart } = useCart();
    const { language } = useLanguage();
    const [lastOreder, setLastOrder] = useState(null);

    useEffect(() => {
        setLastOrder(cart?.last_order);
    }, [cart?.last_order]);

    if (!lastOreder) {
        return <Loader />;
    }

    const getProductMedia = (product) => {
        const additionalMedia =
            product?.images
                ?.map((media) =>
                    typeof media === "string"
                        ? media
                        : media?.image_path || media?.image || media?.path
                )
                .filter(Boolean) || [];

        const videoMedia = [
            product?.video,
            product?.video_path,
            product?.image,
            product?.image_path,
            ...additionalMedia,
        ].find((media) =>
            String(media || "")
                .toLowerCase()
                .split("?")[0]
                .endsWith(".mp4")
        );

        return {
            media:
                videoMedia ||
                product?.image ||
                product?.image_path ||
                additionalMedia[0],
            isVideo: Boolean(videoMedia),
        };
    };

    const getMediaUrl = (path) => {
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

    const normalizeOrderOptions = (item) => {
        const candidates = [
            item?.selected_options,
            item?.order_options,
            item?.product_options,
            item?.option_values,
            item?.options,
        ];

        const options = candidates.find(
            (value) => Array.isArray(value) && value.length > 0
        );

        if (options) {
            return options;
        }

        const singleValue =
            item?.selected_size ||
            item?.size ||
            item?.option_name ||
            item?.option_value;

        if (!singleValue) {
            return [];
        }

        return [
            {
                id: `selected-${item?.id || "option"}`,
                name: singleValue,
                option: {
                    name: {
                        bg: "Размер",
                        en: "Size",
                    },
                },
            },
        ];
    };

    const getOptionLabel = (option) =>
        option?.option?.name?.[language] ||
        option?.label?.[language] ||
        option?.label ||
        option?.option_name?.[language] ||
        option?.option_name ||
        t("Size");

    const getOptionValue = (option) =>
        option?.selected_value?.name?.[language] ||
        option?.selected_value?.name ||
        option?.value?.name?.[language] ||
        option?.value?.name ||
        option?.option_value?.name?.[language] ||
        option?.option_value?.name ||
        option?.value ||
        option?.option_value ||
        option?.name?.[language] ||
        option?.name ||
        "";

    const getPaymentMethodCode = (order) =>
        String(
            order?.payment_method?.value ||
                order?.payment_method?.code ||
                order?.payment_method_slug ||
                order?.payment_method_type ||
                order?.payment_method ||
                ""
        )
            .trim()
            .toLowerCase();

    const isOnlinePayment = (order) => {
        const method = getPaymentMethodCode(order);

        return [
            "online_pos",
            "online",
            "card",
            "credit_card",
            "debit_card",
            "stripe",
            "borica",
        ].includes(method);
    };

    const isCashOnDelivery = (order) => {
        const method = getPaymentMethodCode(order);

        return [
            "at_delivery",
            "cash_on_delivery",
            "cash",
            "cod",
            "delivery",
            "nalojen_platej",
            "наложен платеж",
        ].includes(method);
    };

    const getPaymentMethodText = (order) => {
        if (isCashOnDelivery(order)) {
            return t("Cash on delivery");
        }

        if (isOnlinePayment(order)) {
            return t("Payment by card");
        }

        const explicitText =
            order?.payment_method_text?.[language] ||
            order?.payment_method_text ||
            order?.payment_text?.[language] ||
            order?.payment_text;

        const normalizedText = String(explicitText || "").toLowerCase();

        if (
            normalizedText.includes("налож") ||
            normalizedText.includes("cash") ||
            normalizedText.includes("delivery")
        ) {
            return t("Cash on delivery");
        }

        if (
            normalizedText.includes("карта") ||
            normalizedText.includes("card") ||
            normalizedText.includes("online")
        ) {
            return t("Payment by card");
        }

        return t("Cash on delivery");
    };

    return (
        <main className="min-h-screen bg-[#050505] text-white">
            <section className="relative overflow-hidden border-b border-white/10 pt-28">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.07),transparent_34%)]" />

                <div className="relative z-10 mx-auto w-[92%] max-w-7xl pb-12 pt-10 md:pb-16">
                    <span className="mb-5 block text-[11px] font-semibold uppercase tracking-[0.28em] text-white/40">
                        Dark Society / {t("Order confirmation")}
                    </span>

                    <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h1 className="text-[clamp(3.2rem,7vw,7rem)] font-black uppercase leading-[0.84] tracking-[-0.06em]">
                                {t("Order Number")}
                                <span className="block text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.65)]">
                                    {lastOreder?.order_number}
                                </span>
                            </h1>
                        </div>

                        <div className="border-l border-white/15 pl-5 md:text-right">
                            <span className="block text-[10px] uppercase tracking-[0.18em] text-white/35">
                                {t("Order Date")}
                            </span>
                            <strong className="mt-2 block text-sm uppercase tracking-[0.08em] text-white/80">
                                {formatDateTime(lastOreder?.created_at)}
                            </strong>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12 md:py-20">
                <div className="mx-auto grid w-[92%] max-w-7xl gap-10 xl:grid-cols-[1.15fr_0.85fr] xl:gap-14">
                    <div className="space-y-8">
                        <section className="border border-white/10 bg-white/[0.025] p-5 md:p-7">
                            <div className="mb-7 flex items-center justify-between border-b border-white/10 pb-5">
                                <div>
                                    <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/35">
                                        01
                                    </span>
                                    <h2 className="text-2xl font-black uppercase tracking-[-0.04em] md:text-3xl">
                                        {t("Order Content")}
                                    </h2>
                                </div>

                                <span className="flex h-10 min-w-10 items-center justify-center border border-white/15 px-3 text-xs font-bold">
                                    {lastOreder?.products?.length || 0}
                                </span>
                            </div>

                            <div className="space-y-5">
                                {lastOreder?.products.map((item) => {
                                    const product = item.product;
                                    const product_options =
                                        normalizeOrderOptions(item);
                                    
                                    const { media, isVideo } =
                                        getProductMedia(product);

                                    return (
                                        <article
                                            key={item.id}
                                            className="border-b border-white/10 pb-6 last:border-b-0"
                                        >
                                            <div className="grid gap-5 sm:grid-cols-[120px_1fr]">
                                                <div className="aspect-[4/5] overflow-hidden bg-white/[0.03]">
                                                    {isVideo ? (
                                                        <video
                                                            className="h-full w-full object-cover"
                                                            src={getMediaUrl(media)}
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
                                                            src={getMediaUrl(media)}
                                                            alt={
                                                                product.name?.[
                                                                    language
                                                                ] || "Продукт"
                                                            }
                                                        />
                                                    )}
                                                </div>

                                                <div className="flex min-w-0 flex-col justify-between">
                                                    <div>
                                                        <h3 className="text-base font-semibold uppercase tracking-[0.04em] text-white md:text-lg">
                                                            {
                                                                product.name?.[
                                                                    language
                                                                ]
                                                            }
                                                        </h3>

                                                        {product_options &&
                                                            product_options.length >
                                                                0 && (
                                                                <div className="mt-4 flex flex-wrap gap-2">
                                                                    {product_options.map(
                                                                        (
                                                                            option
                                                                        ) => (
                                                                            <span
                                                                                key={
                                                                                    option.id
                                                                                }
                                                                                className="border border-white/10 bg-white/[0.03] px-3 py-2 text-[10px] uppercase tracking-[0.12em] text-white/60"
                                                                            >
                                                                                {getOptionLabel(
                                                                                    option
                                                                                )}
                                                                                :{" "}
                                                                                <strong className="text-white">
                                                                                    {getOptionValue(
                                                                                        option
                                                                                    )}
                                                                                </strong>
                                                                            </span>
                                                                        )
                                                                    )}
                                                                </div>
                                                            )}
                                                    </div>

                                                    <div className="mt-6 grid grid-cols-3 gap-4 border-t border-white/10 pt-4">
                                                        <div>
                                                            <span className="block text-[10px] uppercase tracking-[0.14em] text-white/30">
                                                                {t("Price")}
                                                            </span>
                                                            <strong className="mt-1 block text-sm">
                                                                {Number(
                                                                    item.price
                                                                ).toFixed(2)}{" "}
                                                                €
                                                            </strong>
                                                        </div>

                                                        <div>
                                                            <span className="block text-[10px] uppercase tracking-[0.14em] text-white/30">
                                                                {t("Quantity")}
                                                            </span>
                                                            <strong className="mt-1 block text-sm">
                                                                {item.quantity}
                                                            </strong>
                                                        </div>

                                                        <div className="text-right">
                                                            <span className="block text-[10px] uppercase tracking-[0.14em] text-white/30">
                                                                {t("Total")}
                                                            </span>
                                                            <strong className="mt-1 block text-sm">
                                                                {(
                                                                    Number(
                                                                        item.price
                                                                    ) *
                                                                    Number(
                                                                        item.quantity
                                                                    )
                                                                ).toFixed(2)}{" "}
                                                                €
                                                            </strong>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            
                                        </article>
                                    );
                                })}
                            </div>
                        </section>

                        <section className="border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent p-5 md:p-7">
                            <div className="mb-6">
                                <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/35">
                                    02
                                </span>
                                <h2 className="text-2xl font-black uppercase tracking-[-0.04em] md:text-3xl">
                                    {t("Summary")}
                                </h2>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-white/50">
                                        {t("Subtotal")}
                                    </span>
                                    <strong>
                                        {Number(
                                            lastOreder?.items_total
                                        ).toFixed(2)}{" "}
                                        €
                                    </strong>
                                </div>

                                {lastOreder?.coupon_id && (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-white/50">
                                            {t("Discount")}{" "}
                                            <span className="text-white/80">
                                                {
                                                    lastOreder?.coupon_details[
                                                        "Код"
                                                    ]
                                                }
                                            </span>
                                        </span>
                                        <strong>
                                            -{" "}
                                            {Number(
                                                lastOreder?.coupon_details[
                                                    "Отстъпка"
                                                ]
                                            ).toFixed(2)}{" "}
                                            €
                                        </strong>
                                    </div>
                                )}

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-white/50">
                                        {t("Shipping")}
                                    </span>
                                    <strong>
                                        {Number(
                                            lastOreder?.delivery_fee
                                        ).toFixed(2)}{" "}
                                        €
                                    </strong>
                                </div>

                                <div className="flex items-end justify-between border-t border-white/10 pt-5">
                                    <span className="text-sm font-bold uppercase tracking-[0.1em]">
                                        {t("Total")}
                                    </span>
                                    <strong className="text-2xl">
                                        {Number(
                                            lastOreder?.total_price
                                        ).toFixed(2)}{" "}
                                        €
                                    </strong>
                                </div>
                            </div>
                        </section>
                    </div>

                    <aside className="h-fit border border-white/10 bg-white/[0.025] p-5 md:p-7 xl:sticky xl:top-28">
                        <div className="mb-7">
                            <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/35">
                                03
                            </span>
                            <h2 className="text-2xl font-black uppercase tracking-[-0.04em] md:text-3xl">
                                {t("Customer")}
                            </h2>
                        </div>

                        <div className="space-y-6">
                            <div className="border-b border-white/10 pb-6">
                                <span className="block text-[10px] uppercase tracking-[0.14em] text-white/30">
                                    {t("Customer")}
                                </span>
                                <strong className="mt-2 block text-base uppercase tracking-[0.05em]">
                                    {lastOreder?.name}
                                </strong>

                                <div className="mt-4 space-y-2 text-sm text-white/55">
                                    <p>{lastOreder?.email}</p>
                                    <p>{lastOreder?.phone}</p>
                                </div>
                            </div>

                            <div className="border-b border-white/10 pb-6">
                                <span className="block text-[10px] uppercase tracking-[0.14em] text-white/30">
                                    {t("Shipping")}
                                </span>

                                <div className="mt-3 flex items-center gap-4">
                                    <img
                                        src="/images/econt-logo-bg-white.svg"
                                        alt="Econt"
                                        className="h-8 w-20 object-contain"
                                    />
                                    <strong className="text-sm uppercase tracking-[0.06em]">
                                        {lastOreder?.delivery_type ==
                                        "econt_office"
                                            ? "До офис"
                                            : "До адрес"}
                                    </strong>
                                </div>
                            </div>

                            <div className="border-b border-white/10 pb-6">
                                <span className="block text-[10px] uppercase tracking-[0.14em] text-white/30">
                                    {t("Shipping Address")}
                                </span>
                                <p className="mt-2 text-sm leading-6 text-white/70">
                                    {lastOreder?.delivery_address}
                                </p>
                            </div>

                            <div
                                className={
                                    isOnlinePayment(lastOreder)
                                        ? "border-b border-white/10 pb-6"
                                        : ""
                                }
                            >
                                <span className="block text-[10px] uppercase tracking-[0.14em] text-white/30">
                                    {t("Payment method")}
                                </span>
                                <strong className="mt-2 block text-sm uppercase tracking-[0.06em]">
                                    {getPaymentMethodText(lastOreder)}
                                </strong>
                            </div>

                            {isOnlinePayment(lastOreder) && (
                                <div>
                                    <span className="block text-[10px] uppercase tracking-[0.14em] text-white/30">
                                        {t("Payment status")}
                                    </span>
                                    <strong className="mt-2 block text-sm uppercase tracking-[0.06em]">
                                        {lastOreder?.payment_status_text}
                                    </strong>
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
            </section>
        </main>
    );
}