import { getCsrfToken } from "../utils";

const baseUrl = process.env.APP_URL;

export const contactRequest = async (requestData) => {
    const csrfToken = getCsrfToken();
    try {
        const response = await fetch(`${baseUrl}/contact-us`, {
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

export const campRequest = async (requestData) => {
    const csrfToken = getCsrfToken();
    try {
        const response = await fetch(`${baseUrl}/camp`, {
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

export const setLocale = async (language) => {
    const csrfToken = getCsrfToken();
    try {
        const response = await fetch(`${baseUrl}/changeLocale`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken,
            },
            body: JSON.stringify(language),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
};
export const getBaseData = async () => {
    try {
        const response = await fetch(`${baseUrl}/base_json`);
        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
};
export const getClientsData = async () => {
    try {
        const response = await fetch(`${baseUrl}/clients_json`);
        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
};
export const getMedicalData = async () => {
    try {
        const response = await fetch(`${baseUrl}/medical_json`);
        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
};
export const getBInfoPage = async (slug) => {
    try {
        const response = await fetch(`${baseUrl}/info_page_json/${slug}`);
        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
};
