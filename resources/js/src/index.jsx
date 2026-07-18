import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
// import "bootstrap/dist/css/bootstrap.min.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { WishListProvider } from "./contexts/WishListContext";
import { LanguageProvider } from "./contexts/LanguageContext";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
        <AuthProvider>
            <LanguageProvider>
                <CartProvider>
                    <WishListProvider>
                        <App />
                    </WishListProvider>
                </CartProvider>
            </LanguageProvider>
        </AuthProvider>
    </BrowserRouter>
);

reportWebVitals();
