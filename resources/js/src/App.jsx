import React, { Suspense, lazy, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { Navigate } from "react-router-dom";

import { useCart } from "./contexts/CartContext";
import { useLanguage } from "./contexts/LanguageContext";

import * as baseService from "./services/baseService";

import Loader from "./components/utils/Loader";
import Header from "./components/Header/Header";
import Foter from "./components/Foter/Foter";
import Subscription from "./pages/Subscription/Subscription";

import BGTranslations from "./locales/bg.json";
import "react-toastify/dist/ReactToastify.css";
import Clients from "./pages/Clients";
import MedicalTeams from "./pages/MedicalTeams";
import ContactUs from "./pages/ContactUs";
import Camp from "./pages/Camp";
import InfoPage from "./pages/InfoPage/InfoPage";

// Lazy loading components
const HomePage = lazy(() => import("./pages/Home/Home"));
const ProductDetailsPage = lazy(() =>
    import("./pages/ProductDetails/ProductDetailsPage")
);
const Products = lazy(() => import("./pages/Products/Products"));
const Cart = lazy(() => import("./pages/Cart"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const About = lazy(() => import("./pages/About"));
const Terms = lazy(() => import("./pages/Terms/Terms"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy/PrivacyPolicy"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy/CookiePolicy"));

function App() {
    const [ baseData, setBaseData ] = useState(null);
    const { addToCart } = useCart();
    const { language } = useLanguage();
    const resources = {
        bg: {
            translation: BGTranslations,
        },
    };

    i18n.use(initReactI18next).init({
        resources,
        lng: language,
        interpolation: {
            escapeValue: false,
        },
    });
    useEffect(() => {
        baseService
            .getBaseData()
            .then((result) => {
                setBaseData(result.data);
            })
            .catch((error) => {
                setBaseData([]);
            });
        // addToCart(null, 1, null, 1);
    }, []);

    return (
        <div className="App">
            <Header
                new_products={baseData?.new_products}
                categories={baseData?.categories}
            />
            <main className="main">
                <Suspense >
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <HomePage
                                    newProducts={baseData?.new_products}
                                    subcriptions={baseData?.subcription}
                                />
                            }
                        />
                        <Route path="/cart" element={<Cart />} />
                        <Route
                            path="/success"
                            element={<OrderConfirmation />}
                        />
                        <Route path="/clients" element={<Clients />} />
                        <Route
                            path="/product/:slug"
                            element={<ProductDetailsPage />}
                        />
                        <Route
                            path="/category/:mainSlug/:childSlug?"
                            element={
                                <Products categories={baseData?.categories} />
                            }
                        />
                        <Route
                            path="/subscription"
                            element={
                                <Subscription
                                    subscriptions={baseData?.subcription}
                                />
                            }
                        />
                        <Route
                            path="/subscription/:slug"
                            element={
                                <Subscription
                                    subscriptions={baseData?.subcription}
                                />
                            }
                        />
                        <Route
                            path="/medical-teams"
                            element={<MedicalTeams />}
                        />
                        <Route path="/contact" element={<ContactUs />} />
                        <Route path="/about-us" element={<About />} />
                        <Route path="/terms-of-use" element={<Terms />} />
                        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                        <Route path="/cookie-policy" element={<CookiePolicy />} />
                        <Route path="/:slug" element={<InfoPage />} />
                        {/* <Route path="/yoloony-camp" element={<Camp />} /> */}
                        {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
                    </Routes>
                </Suspense>
            </main>
            <Foter />
            <ToastContainer />
        </div>
    );
}

export default App;
