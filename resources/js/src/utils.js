export const getCsrfToken = () => {
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    if (metaTag) {
        return metaTag.getAttribute("content");
    }
    return null;
};
export function formatDateTime(dateString, time = true, shortMonth = false) {
    const date = new Date(dateString);
    const options = {
        year: "numeric",
        month: shortMonth ? "short" : "long",
        day: "numeric",
    };
    if (time) {
        options.hour = "numeric";
        options.minute = "numeric";
    }
    return date.toLocaleDateString("bg-BG", options);
}
