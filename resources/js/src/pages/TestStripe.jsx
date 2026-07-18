import { toast } from "react-toastify";

import { useState } from "react";
import * as cartService from "../services/cartService";
export default function TestStripe() {
    const [stripeUrl, setStripeUrl] = useState(null);
    const [deliveryData, setDeliveryData] = useState({
        additional_info: "STRIPE TEST",
        buyer_email: "dimitrsergeev49@gmail.com",
        buyer_name: "Димитър Сергеев",
        buyer_phone: "0882613775",
        delivery_type: "econt_address",
        econt_city: "Стара Загора, Стара Загора",
        econt_city_id: 42,
        econt_office: "",
        econt_office_id: "",
        econt_street: "ул. Георги Сава Раковски",
        econt_street_id: 4426,
        econt_street_number: '95',
        order_confirm: true,
        payment_method: "online_pos",
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        if (deliveryData.order_confirm === false) {
            toast.error("Моля съгласете се с общите условия!");
            return;
        }

        cartService
            .createOrder(deliveryData)
            .then((res) => {
                if (res.success) {
                    toast.success(
                        `Поръчка № ${res.order_id} е направена успешно!`
                    );
                    setStripeUrl(res.url);
                    // resetCart();
                    // scroll to top of the page with smoth animation
                    window.scrollTo({ top: 0, behavior: "smooth" });
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
            });
    };
    return (
        <div style={{ padding: "20px", backgroundColor: "white" }}>
            <h1>Test Stripe</h1>
            <form onSubmit={handleSubmit}>
                <button
                    type="submit"
                    style={{
                        background: "black",
                        color: "white",
                        padding: "20px",
                    }}
                >
                    Test
                </button>
                {stripeUrl && (
                    <a
                        href={stripeUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                            display: "block",
                            marginTop: "20px",
                            textDecoration: "underline",
                        }}
                    >
                        Click here to pay
                    </a>
                )}
            </form>
        </div>
    );
}
