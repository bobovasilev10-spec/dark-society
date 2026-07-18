const baseUrl = process.env.APP_URL;

export const getSubscriptionBySlug = async (slug) => {
    try {
        const response = await fetch(`${baseUrl}/subscribe/${slug}`);
        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
}