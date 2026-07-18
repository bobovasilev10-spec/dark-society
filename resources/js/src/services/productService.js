import { getCsrfToken } from "../utils";

const baseUrl = process.env.APP_URL;

export const getCategoryData = async (slug) => {
    try {
        const response = await fetch(`${baseUrl}/category_json/${slug}`);
        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
};

export const getProduct = async (slug) => {
    try {
        const response = await fetch(`${baseUrl}/product_json/${slug}`);
        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
};

export const getSearchResults = async (params) => {

    let searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {

        if (value) {
            searchParams.append(key, value);
        }
    });
    searchParams.toString();

    try {
        const response = await fetch(`${baseUrl}/search_json?${searchParams}`);

        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
};
