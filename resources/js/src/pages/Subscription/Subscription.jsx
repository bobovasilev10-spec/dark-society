import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from 'react-toastify';

import { useCart } from "../../contexts/CartContext";

import './Subscription.css';
import { useLanguage } from "../../contexts/LanguageContext";
import { useTranslation } from "react-i18next";

import parse from 'html-react-parser';
const Subscription = ({ subscriptions }) => {
    const [subscription, setSubscription] = useState({});

    const navigate = useNavigate();
    const { slug } = useParams();

    const { addToCart } = useCart();
    const { language } = useLanguage();
    const { t } = useTranslation();
    useEffect(() => {
        if (slug && subscriptions?.length > 0) {
            const foundSubscription = subscriptions.find(item => item.slug === slug);
            setSubscription(foundSubscription || {});
        }
    }, [slug, subscriptions]); // добави зависимостите slug и subscriptions

    const handleAddToCart = (item,qty) => {
        addToCart(null, qty, '', item.id);
        toast.success(
            <div>
                <p>{`${t('Successfuly add')} ${item.name[language]} ${t('in cart')}.`}</p>
                <div className="flex justify-center">
                    <button
                        onClick={handleOrderFinish}
                        className="button-86"
                    >
                        {t('Checkout')}
                    </button>
                </div>
            </div>,
            {autoClose: 2000}
        );

    };

    const handleOrderFinish = () => {
        toast.dismiss();
        navigate("/cart");
    };

    return (
        <div className="bg-back">
            <div className="container background_img mx-auto py-10">
                {!slug ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 mx-10">
                        {subscriptions?.length > 0 &&
                            subscriptions.map((item, index) => (
                                <div
                                    className="subscription cursor-pointer"
                                    key={index}
                                >
                                    <a href={`/subscription/${item.slug}`}>
                                        <img
                                            className="absolute top-0 left-0 object-cover h-full w-full rounded-xl cursor-pointer opacity-80 hover:opacity-100 transition ease-in-out delay-50 duration-500 hover:shadow-[0_10px_50px_rgba(255,255,255,0.3)]"
                                            src={`/storage/${item?.image}`}
                                            alt="Training"
                                        />
                                    </a>
                                    <div className="absolute bottom-0 w-full h-1/2 2xl:h-3/6 py-1 bg-black bg-opacity-70 rounded-b-xl">
                                        <div className="h-full flex flex-col items-center justify-between py-3 text-white">
                                            <h3 className="text-center text-white text-2xl  cursor-default uppercase px-10 text-center">
                                                {item?.name[language]}
                                            </h3>
                                            {item.promo_price > 0 ? (
                                                <div className="flex flex-col items-center text-lg">
                                                    <span className="line-through decoration-2 text-red-500">
                                                        {t("Price")}: {Number(item?.price).toFixed(2)} €
                                                    </span>
                                                    <span>
                                                        {t("Price")}: {Number(item?.promo_price).toFixed(2)} €
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center">
                                                    <p>
                                                        {t("Price")}: {Number(item?.price).toFixed(2)} €
                                                    </p>
                                                </div>
                                            )}
                                            <div className="flex justify-center">
                                                <button
                                                    className="button-86"
                                                    onClick={() =>
                                                        handleAddToCart(item, 1)
                                                    }
                                                >
                                                    {t("Buy")}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        {subscription?.id && (
                            <div className="grid grid-cols-12">
                                <div className="col-span-12 md:col-span-5 xl:col-span-5 px-5 xl:px-0">
                                    <img
                                        className="rounded-xl"
                                        src={`/storage/${subscription?.image}`}
                                        alt="Training"
                                    />
                                </div>
                                <div className="col-span-12 md:col-span-7 xl:col-span-7 flex flex-col items-center mt-5">
                                    <h3 className="text-xl w-[300px] md:w-auto lg:text-3xl font-bold text-white mb-5 text-center">
                                        {subscription?.name[language]}
                                    </h3>
                                    {subscription.promo_price > 0 ? (
                                        <div className="flex flex-col items-center text-lg">
                                            <span className="line-through decoration-2 text-red-500">
                                                {t("Price")}: {Number(subscription?.price).toFixed(2)} €
                                            </span>
                                            <span className="text-white text-2xl">
                                                {t("Price")}: {Number(subscription?.promo_price).toFixed(2)} €
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <p className="text-white text-2xl">
                                                {t("Price")}: {Number(subscription?.price).toFixed(2)} €
                                            </p>
                                        </div>
                                    )}
                                    <div>
                                        <button
                                            className="button-86"
                                            onClick={() =>
                                                handleAddToCart(subscription, 1)
                                            }
                                        >
                                            {t("Buy")}
                                        </button>
                                    </div>
                                    <div className="text-start">
                                        <div className="text-lg mt-5 max-w-full overflow-hidden overflow-ellipsis whitespace-normal text-white mx-10 lg:mx-20">
                                            {subscription?.content[language] &&
                                                parse(
                                                    subscription?.content[
                                                        language
                                                    ]
                                                )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Subscription;
