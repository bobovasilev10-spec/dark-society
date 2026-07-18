import { getCsrfToken } from "../utils";

const baseUrl = process.env.APP_URL;

export const changePassword = async (passwordData) => {
    const csrfToken = getCsrfToken();
    try {
        const response = await fetch(`${baseUrl}/change-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken,
            },
            body: JSON.stringify(passwordData),
        });
        const result = await response.json();
        return result;
    } catch (err) {
        throw err;
    }
};

export const login = async (user) => {
    const csrfToken = getCsrfToken();
    try {
        const response = await fetch(`${baseUrl}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken,
            },
            body: JSON.stringify(user),
        });
        const result = await response.json();
        return result;
    } catch (err) {
        throw err;
    }
};
export const register = async (registerData) => {
    const csrfToken = getCsrfToken();
    try {
        const response = await fetch(`${baseUrl}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken,
            },
            body: JSON.stringify(registerData),
        });
        const result = await response.json();
        return result;
    } catch (err) {
        throw err;
    }
};
export const logout = async () => {
    const csrfToken = getCsrfToken();
    try {
        const response = await fetch(`${baseUrl}/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken,
            },
            body: JSON.stringify({}),
        });
        const result = await response.json();
        return result;
    } catch (err) {
        throw err;
    }
};

export const getOrdersData = async () => {
    const csrfToken = getCsrfToken();
    try {
        const response = await fetch(`${baseUrl}/user-orders`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken,
            },
        });
        const result = await response.json();
        return result;
    } catch (err) {
        throw err;
    }
};

export const resetPasswordRequest = async (email) => {

    const csrfToken = getCsrfToken();
    try {
        const response = await fetch(`${baseUrl}/reset-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken,
            },
            body: JSON.stringify(email),
        });
        const result = await response.json();
        return result;
    } catch (err) {
        throw err;
    }
};

export const checkResetToken = async (data) => {
    const csrfToken = getCsrfToken();
    try {
        const response = await fetch(`${baseUrl}/check-reset-token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken,
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        return result;
    } catch (err) {
        throw err;
    }
};

export const resetPassword = async (data) => {
    const csrfToken = getCsrfToken();
    try {
        const response = await fetch(`${baseUrl}/set-new-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken,
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        return result;
    } catch (err) {
        throw err;
    }
};

export const updateProfileInfo = async (userData) => {
    const csrfToken = getCsrfToken();
    try {
        const response = await fetch(`${baseUrl}/update-user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken,
            },
            body: JSON.stringify(userData),
        });
        const result = await response.json();
        return result;
    } catch (err) {
        throw err;
    }
};
