import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/src/**/*.jsx",
        "./app/Filament/**/*.php",
        "./resources/views/filament/**/*.blade.php",
        "./vendor/filament/**/*.blade.php",
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ["Figtree", ...defaultTheme.fontFamily.sans],
            },
            maxHeight: {
                "mh-700": "700px",
            },
            minHeight: {
                "mh-700": "700px",
            },
            backgroundColor: {
                "custom-bg": "hsl(0, 0%, 98%)",
                "card-bg": "hsla(0,0%,100%,0.55)",
            },
            gridTemplateColumns: {
                "nav-grid": "1fr 3fr",
            },
            margin: {
                "important-none": "0px auto !important",
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
        },
    },

    plugins: [forms],
};
