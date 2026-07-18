import { useState } from "react";
import { toast } from "react-toastify";

import { useCart } from "../../../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../contexts/LanguageContext";
import { useTranslation } from "react-i18next";


const Details = ({ productData, viewHandler }) => {

    const [ selectedSize, setSelectedSize ] = useState({ name: "", id: "" });
    const [ selectedCount, setSelectedCount ] = useState(1);
    const [ errorHandler, setErrorHandler ] = useState({ error: false, errorMessage: '' });

    const navigate = useNavigate();

    const { addToCart } = useCart();
    const { language } = useLanguage(); 
    const { t } = useTranslation();

    const handleOrderFinish = () => {
        toast.dismiss();
        navigate("/cart");
    };

    function addProductToCart() {

        if (selectedSize.name.length < 1 && productData.options.length > 0) {
            setErrorHandler({ error: true, errorMessage: t('Select size')});
        } else {
            const isHave = productData.options.find(
                (el) => el.id === selectedSize.id
            );
            if (isHave.qty > 0) {
                addToCart(productData.id, selectedCount, selectedSize.id);
                toast.success(
                    <div>
                        <p>{`${productData.name[language] || ''} ${selectedCount}${t('qty')} ${selectedSize.name} ${t('add to cart')}.`}</p>
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
                setSelectedSize(false);
                setSelectedCount(1);
                viewHandler();
            } else {
                setErrorHandler({ error: true, errorMessage: t('Out of stock') });
                toast.warning(
                    <div>
                        <p>{`${t('Out of stock')} ${productData.name} ${t('Size')} ${selectedSize.name}.`}</p>
                        <div className="flex justify-center">
                            <button
                                onClick={handleOrderFinish}
                                className="button-86"
                            >
                                {t('Checkout')}
                            </button>
                        </div>
                    </div>
                );
            }
        }
    }

    function addSize(name, id, qty) {
        if (selectedSize.qty > qty) {
            setSelectedCount(qty);
        }
        setSelectedSize({ name, id, qty });
        setErrorHandler({ error: false, errorMessage: "" });
    }

    return (
        <div className="details_container relative flex justify-center w-full h-full gap-5 text-white items-center text-center py-9 rounded-xl">
            <div
                className="absolute top-2 right-5 hover:text-red-500"
                onClick={viewHandler}
            >
                <span className="text-3xl cursor-pointer">X</span>
            </div>

            <div className="flex flex-col gap-2 justify-between h-full py-10">
                <h3 className="text-2xl font-bold">{productData.name[language]}</h3>
                <p className="text-xl mt-3 font-semibold">
                    {t('Price')}: {Number(productData.price).toFixed(2)} €
                </p>
                {productData?.options?.length > 0 && (
                    <div className="flex gap-2 text-lg justify-center items-center">
                        Размер: {selectedSize.name}
                        {errorHandler.error && (
                            <div className="py-1">
                                <p className="text-lg underline underline-offset-4 text-red-500 ">
                                    {errorHandler.errorMessage}
                                </p>
                            </div>
                        )}
                    </div>
                )}
                <div className="flex flex-wrap gap-2 justify-center">
                    {productData?.options?.map((option, index) => (
                        <span
                            key={index}
                            className={`relative ${
                                option.qty > 0
                                    ? selectedSize.name === option.name
                                        ? "border-white text-white font-bold"
                                        : "border-gray-500 text-gray-500"
                                    : "border-red-500 text-red-500 opacity-50 cursor-not-allowed"
                            } cursor-pointer border-2 p-3 text-lg rounded-xl hover:font-bold w-18`}
                            onClick={() =>
                                addSize(option.name, option.id, option.qty)
                            }
                        >
                            {option.name}
                        </span>
                    ))}
                </div>

                <div className="flex justify-center text-white mt-5">
                    <div className="border-2 border-white py-1 rounded-xl px-3">
                        <span
                            className="cursor-pointer text-lg"
                            onClick={() =>
                                setSelectedCount(
                                    (prev) => (prev = prev > 1 ? prev - 1 : 1)
                                )
                            }
                        >
                            -
                        </span>
                        <span className="border-x-2 border-white px-3 mx-3 text-xl">
                            {selectedCount}
                        </span>
                        <span
                            className="cursor-pointer text-lg"
                            onClick={() =>
                                setSelectedCount((prev) => (prev += 1))
                            }
                        >
                            +
                        </span>
                    </div>
                </div>

                <div className="flex justify-center mt-5">
                    <button
                        className="add_button py-2 px-7 border-2 border-white rounded-xl"
                        onClick={addProductToCart}
                    >
                        <span className="py-4">{t('Buy')}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Details;
