import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";

import { useLanguage } from "../contexts/LanguageContext";
import EcontOffice from "../components/Cart/Econt/EcontOffice";
import EcontAddress from "../components/Cart/Econt/EcontAddress";
import { useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";
import { useTranslation } from "react-i18next";

import * as cartService from "../services/cartService";
import { toast } from "react-toastify";
import Loader from "../components/utils/Loader";
export default function Cart() {
    const { t } = useTranslation();
    const { cart, applyCoupon, removeCoupon } = useCart();
    const { language } = useLanguage();
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [deliveryType, setDeliveryType] = useState("econt_office");
    const [formData, setFormData] = useState({
        buyer_name: "",
        buyer_email: "",
        buyer_phone: "",
        additional_info: "",
        delivery_type: deliveryType,
        econt_city: "",
        econt_street: "",
        econt_street_number: "",
        econt_street_id: "",
        econt_city_id: "",
        econt_office_id: "",
        econt_office: "",
        order_confirm: true,
        payment_method: "at_delivery",
    });
    const [deliveryFee, setDeliveryFee] = useState(0);

    const [coupon, setCoupon] = useState("");
    const addCoupon = (e) => {
        e.preventDefault();
        if (coupon === "") {
            return;
        }
        applyCoupon(coupon);
    };
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);
    useEffect(() => {
        if (cart && cart?.cart_items?.length < 1) {
            navigate("/");
        }
    }, [cart?.cart_items]);

    useEffect(() => {
        if (cart?.requiers_delivery === false) {
            setDeliveryType("store_pickup");
            setFormData((prevFormData) => ({
                ...prevFormData,
                delivery_type: "store_pickup",
                payment_method: "online_pos",
            }));
        }
    }, [cart?.requiers_delivery]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.order_confirm === false) {
            toast.error("Моля съгласете се с общите условия!");
            return;
        }

        setLoading(true);

        cartService
            .createOrder(formData)
            .then((res) => {
                if (res.success) {
                    if (res.url) {
                        setLoading(false);
                       return window.location = res.url;
                    }
                    toast.success(
                        `Поръчка № ${res.order_id} е направена успешно!`
                    );
                    // scroll to top of the page with smoth animation
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    window.location = "/success";
                    // navigate("/success");
                } else {
                    Object.entries(res.errors).forEach(([field, errors]) => {
                        if (Array.isArray(errors)) {
                            errors.forEach((err) => {
                                toast.error(err);
                            });
                        } else {
                            toast.error(errors);
                        }
                    });
                }
            })
            .catch((error) => {
            })
            .finally(() => {
                setLoading(false);
            });
    };
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: type === "checkbox" ? checked : value,
        }));
    };
    const handleEcontStates = (updates) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            ...updates,
        }));
    };

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            econt_city: "",
            econt_city_id: "",
        }));
    }, [formData.delivery_type]);
    const handleDeliveryChange = (event) => {
        setDeliveryType(event.target.value);
        setFormData((prevFormData) => ({
            ...prevFormData,
            delivery_type: event.target.value,
        }));
    };

    if (!cart?.cart_items) {
        return <Loader />;
    }

    return (
        <main className="min-h-screen bg-[#050505] text-white">
            <section className="relative overflow-hidden border-b border-white/10 pt-28">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.07),transparent_34%)]" />

                <div className="relative z-10 mx-auto w-[92%] max-w-7xl pb-12 pt-10 md:pb-16">
                    <span className="mb-5 block text-[11px] font-semibold uppercase tracking-[0.28em] text-white/40">
                        Dark Society / {t("Количка")}
                    </span>

                    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h1 className="text-[clamp(3.4rem,8vw,7.5rem)] font-black uppercase leading-[0.84] tracking-[-0.06em]">
                                {t("Завърши")}
                                <span className="block text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.6)]">
                                    {t("поръчката")}
                                </span>
                            </h1>
                        </div>

                        <p className="max-w-md text-sm leading-7 text-white/50 md:text-right">
                            {t(
                                "Провери продуктите, въведи данните си и избери удобен начин за доставка и плащане."
                            )}
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-12 md:py-20">
                <div className="mx-auto grid w-[92%] max-w-7xl gap-10 xl:grid-cols-[0.82fr_1.18fr] xl:gap-14">
                    {/* Order summary */}
                    <aside className="h-fit xl:sticky xl:top-28">
                        <div className="border border-white/10 bg-white/[0.025] p-5 md:p-7">
                            <div className="mb-7 flex items-center justify-between gap-4 border-b border-white/10 pb-5">
                                <div>
                                    <span className="mb-2 block text-[10px] uppercase tracking-[0.2em] text-white/35">
                                        01
                                    </span>
                                    <h2 className="text-2xl font-black uppercase tracking-[-0.04em] md:text-3xl">
                                        {t("Съдържание на поръчката")}
                                    </h2>
                                </div>

                                <span className="flex h-10 min-w-10 items-center justify-center border border-white/15 px-3 text-xs font-bold">
                                    {cart?.cart_items?.length || 0}
                                </span>
                            </div>

                            <div className="space-y-5">
                                {cart?.cart_items?.map((item, i) => {
                                    const product = item.product;

                                    const additionalMedia =
                                        product?.images
                                            ?.map((media) =>
                                                typeof media === "string"
                                                    ? media
                                                    : media?.image_path ||
                                                      media?.image ||
                                                      media?.path
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

                                    const cartMedia =
                                        videoMedia ||
                                        product?.image ||
                                        product?.image_path ||
                                        additionalMedia[0];

                                    const cartMediaIsVideo = Boolean(videoMedia);

                                    const getMediaUrl = (path) => {
                                        if (!path) {
                                            return "/images/products/product-1.png";
                                        }

                                        const normalized = String(path).replace(
                                            /\\\\/g,
                                            "/"
                                        );

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

                                        return `/storage/${normalized.replace(
                                            /^public\//,
                                            ""
                                        )}`;
                                    };

                                    return (
                                        <article
                                            key={i}
                                            className="grid grid-cols-[92px_1fr] gap-4 border-b border-white/10 pb-5 last:border-b-0"
                                        >
                                            <div className="aspect-[4/5] overflow-hidden bg-white/[0.03]">
                                                {cartMediaIsVideo ? (
                                                    <video
                                                        className="h-full w-full object-cover"
                                                        src={getMediaUrl(cartMedia)}
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
                                                        src={getMediaUrl(cartMedia)}
                                                        alt={product.name?.[language] || "Продукт"}
                                                    />
                                                )}
                                            </div>

                                            <div className="flex min-w-0 flex-col justify-between py-1">
                                                <div>
                                                    <h3 className="line-clamp-2 text-sm font-semibold uppercase tracking-[0.04em] text-white md:text-base">
                                                        {product.name?.[language]}
                                                    </h3>

                                                    {item.options?.length > 0 && (
                                                        <p className="mt-3 text-xs uppercase tracking-[0.12em] text-white/40">
                                                            {t("Размер")}:{" "}
                                                            <span className="text-white/80">
                                                                {item?.options?.[0]?.name}
                                                            </span>
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="mt-4 flex items-end justify-between gap-3">
                                                    <span className="text-xs text-white/35">
                                                        {item.quantity} × {Number(item.price).toFixed(2)} €
                                                    </span>

                                                    <strong className="text-sm">
                                                        {(Number(item.quantity) * Number(item.price)).toFixed(2)} €
                                                    </strong>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>

                            <form onSubmit={addCoupon} className="mt-7">
                                <label className="mb-3 block text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
                                    {t("Промо код")}
                                </label>

                                <div className="flex border border-white/15 bg-black/20">
                                    <input
                                        type="text"
                                        placeholder={t("Въведи код")}
                                        value={coupon}
                                        onChange={(e) => setCoupon(e.target.value)}
                                        className="min-w-0 flex-1 border-0 bg-transparent px-4 py-4 text-sm text-white outline-none placeholder:text-white/20 focus:ring-0"
                                    />

                                    <button
                                        type="submit"
                                        className="border-l border-white/15 px-5 text-[10px] font-black uppercase tracking-[0.14em] text-white transition hover:bg-white hover:text-black"
                                    >
                                        {t("Приложи")}
                                    </button>
                                </div>
                            </form>

                            {cart?.coupon && (
                                <div className="mt-5 flex items-center justify-between gap-4 border border-white/10 bg-white/[0.03] p-4">
                                    <div>
                                        <span className="block text-[10px] uppercase tracking-[0.16em] text-white/35">
                                            {t("Активен промо код")}
                                        </span>
                                        <strong className="mt-1 block text-sm uppercase tracking-[0.1em]">
                                            {cart?.coupon.coupon.code}
                                        </strong>
                                    </div>

                                    <div className="text-right">
                                        <strong className="block text-sm">
                                            - {cart?.coupon.coupon.discount}{" "}
                                            {cart?.coupon.coupon.discount_type === "percent" ? "%" : "€"}
                                        </strong>
                                        <button
                                            type="button"
                                            className="mt-1 text-[10px] uppercase tracking-[0.12em] text-white/40 underline underline-offset-4 hover:text-white"
                                            onClick={() => removeCoupon()}
                                        >
                                            {t("Премахни")}
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="mt-7 space-y-4 border-t border-white/10 pt-6">
                                <div className="flex items-start justify-between gap-4 text-sm">
                                    <span className="text-white/50">{t("Междинна сума")}</span>
                                    <div className="text-right">
                                        <strong className="block">
                                            {Number(cart?.total).toFixed(2)} €
                                        </strong>
                                    </div>
                                </div>

                                <div className="flex items-start justify-between gap-4 text-sm">
                                    <span className="text-white/50">{t("Доставка")}</span>
                                    <div className="text-right">
                                        <strong className="block">
                                            {Number(deliveryFee).toFixed(2)} €
                                        </strong>
                                    </div>
                                </div>

                                <div className="flex items-end justify-between gap-4 border-t border-white/10 pt-5">
                                    <span className="text-sm font-bold uppercase tracking-[0.1em]">
                                        {t("Общо")}
                                    </span>
                                    <div className="text-right">
                                        <strong className="block text-2xl">
                                            {(Number(deliveryFee) + Number(cart?.total)).toFixed(2)} €
                                        </strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Checkout form */}
                    <div className="border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent p-5 md:p-8 lg:p-10">
                        <div className="mb-10 flex items-start justify-between gap-6">
                            <div>
                                <span className="mb-3 block text-[10px] uppercase tracking-[0.2em] text-white/35">
                                    02
                                </span>
                                <h2 className="text-3xl font-black uppercase leading-none tracking-[-0.04em] md:text-5xl">
                                    {t("Данни за поръчката")}
                                </h2>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-10">
                            <section>
                                <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.16em] text-white/45">
                                    {t("Лични данни")}
                                </h3>

                                <div className="grid gap-6 md:grid-cols-3">
                                    {[
                                        ["buyer_name", "text", t("Вашето име")],
                                        ["buyer_email", "email", t("Вашият имейл")],
                                        ["buyer_phone", "text", t("Телефонен номер")],
                                    ].map(([name, type, placeholder]) => (
                                        <label key={name} className="block">
                                            <input
                                                type={type}
                                                name={name}
                                                placeholder={placeholder}
                                                value={formData[name]}
                                                onChange={handleChange}
                                                required
                                                className="w-full border-0 border-b border-white/20 bg-transparent px-0 py-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-white focus:ring-0"
                                            />
                                        </label>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.16em] text-white/45">
                                    {t("Начин на доставка")}
                                </h3>

                                {cart?.requiers_delivery ? (
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {[
                                            ["econt_address", "delivery_address", t("Доставка до адрес")],
                                            ["econt_office", "delivery_office", t("Доставка до офис")],
                                        ].map(([value, id, label]) => (
                                            <div key={value}>
                                                <input
                                                    className="peer sr-only"
                                                    type="radio"
                                                    name="delivery"
                                                    id={id}
                                                    value={value}
                                                    checked={deliveryType === value}
                                                    onChange={handleDeliveryChange}
                                                />
                                                <label
                                                    htmlFor={id}
                                                    className="flex min-h-28 cursor-pointer items-center gap-4 border border-white/10 bg-black/20 p-5 transition hover:border-white/30 peer-checked:border-white peer-checked:bg-white/[0.06]"
                                                >
                                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/40">
                                                        <span className="h-2 w-2 rounded-full bg-white opacity-0 peer-checked:opacity-100" />
                                                    </span>

                                                    <div className="min-w-0 flex-1">
                                                        <strong className="text-sm uppercase tracking-[0.08em]">
                                                            {label}
                                                        </strong>
                                                    </div>

                                                    <img
                                                        src="/images/econt-logo-bg-white.svg"
                                                        alt="Econt"
                                                        className="h-8 w-20 object-contain"
                                                    />
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="border border-white bg-white/[0.05] p-6">
                                        <span className="text-sm font-semibold uppercase tracking-[0.08em]">
                                            {t("Продуктите не изискват доставка")}
                                        </span>
                                    </div>
                                )}
                            </section>

                            {cart?.requiers_delivery && (
                                <section>
                                    <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.16em] text-white/45">
                                        {t("Адрес за доставка")}
                                    </h3>

                                    <div className="[&_input]:border-white/20 [&_input]:bg-transparent [&_input]:text-white [&_select]:border-white/20 [&_select]:bg-[#0a0a0a] [&_select]:text-white">
                                        {deliveryType === "econt_address" && (
                                            <EcontAddress
                                                formData={formData}
                                                handleChange={handleChange}
                                                handleEcontStates={handleEcontStates}
                                                setDeliveryFee={setDeliveryFee}
                                            />
                                        )}

                                        {deliveryType === "econt_office" && (
                                            <EcontOffice
                                                formData={formData}
                                                handleChange={handleChange}
                                                handleEcontStates={handleEcontStates}
                                                setDeliveryFee={setDeliveryFee}
                                            />
                                        )}
                                    </div>
                                </section>
                            )}

                            

                            <section>
                                <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.16em] text-white/45">
                                    {t("Начин на плащане")}
                                </h3>

                                <div
                                    className={`grid gap-4 ${
                                        cart?.requiers_delivery === false ? "" : "md:grid-cols-2"
                                    }`}
                                >
                                    {cart?.requiers_delivery !== false && (
                                        <div>
                                            <input
                                                className="peer sr-only"
                                                type="radio"
                                                name="payment_method"
                                                id="at_delivery"
                                                value="at_delivery"
                                                checked={formData.payment_method === "at_delivery"}
                                                onChange={handleChange}
                                            />
                                            <label
                                                htmlFor="at_delivery"
                                                className="flex min-h-24 cursor-pointer items-center gap-4 border border-white/10 bg-black/20 p-5 transition hover:border-white/30 peer-checked:border-white peer-checked:bg-white/[0.06]"
                                            >
                                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/40" />
                                                <strong className="text-sm uppercase tracking-[0.08em]">
                                                    {t("Наложен платеж")}
                                                </strong>
                                            </label>
                                        </div>
                                    )}

                                    <div>
                                        <input
                                            className="peer sr-only"
                                            type="radio"
                                            name="payment_method"
                                            id="online_pos"
                                            value="online_pos"
                                            checked={formData.payment_method === "online_pos"}
                                            onChange={handleChange}
                                        />
                                        <label
                                            htmlFor="online_pos"
                                            className="flex min-h-24 cursor-pointer items-center gap-4 border border-white/10 bg-black/20 p-5 transition hover:border-white/30 peer-checked:border-white peer-checked:bg-white/[0.06]"
                                        >
                                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/40" />
                                            <strong className="text-sm uppercase tracking-[0.08em]">
                                                {t("Плащане с карта")}
                                            </strong>
                                        </label>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <label className="flex cursor-pointer items-start gap-3 border-t border-white/10 pt-6">
                                    <input
                                        type="checkbox"
                                        name="order_confirm"
                                        checked={formData.order_confirm}
                                        onChange={handleChange}
                                        className="mt-1 h-4 w-4 accent-white"
                                    />
                                    <span className="text-xs leading-6 text-white/45">
                                        {t(
                                            "Съгласявам се с общите условия и потвърждавам, че предоставените данни са верни."
                                        )}
                                    </span>
                                </label>
                            </section>

                            <div className="flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
                                <p className="max-w-md text-xs leading-6 text-white/35">
                                    {t(
                                        "След изпращане на поръчката ще получите потвърждение с всички детайли."
                                    )}
                                </p>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="group inline-flex min-w-[230px] items-center justify-between gap-8 border border-white bg-white px-5 py-4 text-[11px] font-black uppercase tracking-[0.14em] text-black transition hover:-translate-y-0.5 hover:bg-transparent hover:text-white disabled:cursor-wait disabled:opacity-50"
                                >
                                    {loading ? (
                                        <span className="mx-auto h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent group-hover:border-white group-hover:border-t-transparent" />
                                    ) : (
                                        <>
                                            <span>{t("Завърши поръчката")}</span>
                                            
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    );
}