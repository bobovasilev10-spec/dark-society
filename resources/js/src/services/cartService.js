import { getCsrfToken } from "../utils";

const baseUrl = process.env.APP_URL;

export const getCart = async () => {
    try {
        const response = await fetch(`${baseUrl}/cart_json`);
        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
};

export const addToCart = async (requestData) => {

    const csrfToken = getCsrfToken();
    try {
        const response = await fetch(`${baseUrl}/cart/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken,
            },
            body: JSON.stringify(requestData),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
};

export const removeFromCart = async (requestData) => {
    const csrfToken = getCsrfToken();
    try {
        const response = await fetch(`${baseUrl}/cart/remove`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken,
            },
            body: JSON.stringify(requestData),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
};

export const updateCart = async (requestData) => {
    const csrfToken = getCsrfToken();
    try {
        const response = await fetch(`${baseUrl}/cart/update`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken,
            },
            body: JSON.stringify(requestData),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
};

export const createOrder = async (requestData) => {
    const csrfToken = getCsrfToken();
    try {
        const response = await fetch(`${baseUrl}/order/confirm`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken,
            },
            body: JSON.stringify(requestData),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
};
export const addCoupon = async (coupon) => {
    const csrfToken = getCsrfToken();
    try {
        const response = await fetch(`${baseUrl}/cart/use-coupon`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken,
            },
            body: JSON.stringify(coupon),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
};
export const removeCoupon = async (coupon) => {
    const csrfToken = getCsrfToken();
    try {
        const response = await fetch(`${baseUrl}/cart/remove-coupon`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken,
            },
            body: JSON.stringify(coupon),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
};
export const calculateDelivery = async (data) => {
    const csrfToken = getCsrfToken();
    try {
        const response = await fetch(`${baseUrl}/order/delivery_type`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken,
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
};
