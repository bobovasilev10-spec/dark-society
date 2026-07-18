import { motion } from "framer-motion";

const links = [
    ["Начало", "/"],
    ["Магазин", "/category/teniski"],
    ["Нова колекция", "/category/teniski"],
    ["За бранда", "/about-us"],
    ["Контакти", "/contact"],
];

const HamburgerMenu = ({ hanburgerMenuHandler }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="hamburger-menu fixed inset-0 flex flex-col justify-between text-white z-50"
        >
            <div className="flex justify-between items-center px-6 py-5 border-b border-white/20">
                <a href="/" className="ds-brand">
                    <span className="ds-brand-mark">DS</span>
                    <span className="ds-brand-name">DARK SOCIETY</span>
                </a>
                <button onClick={hanburgerMenuHandler} className="text-3xl" aria-label="Затвори менюто">
                    <i className="fa-solid fa-xmark"></i>
                </button>
            </div>

            <nav className="flex flex-col items-start justify-center gap-5 px-7">
                {links.map(([label, href], index) => (
                    <motion.a
                        key={label}
                        initial={{ x: 60, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: .4, delay: index * .07 }}
                        className="w-full border-b border-white/20 pb-4 text-3xl font-bold uppercase tracking-tight"
                        href={href}
                    >
                        {label}
                    </motion.a>
                ))}
            </nav>

            <div className="flex items-center justify-between px-7 py-6 border-t border-white/20">
                <span className="text-xs uppercase tracking-widest text-gray-500">Следвай движението</span>
                <div className="flex gap-6 text-xl">
                    <a href="https://www.instagram.com/darksociety.wear" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
                    <a href="https://www.tiktok.com/@darksociety.wear" aria-label="TikTok"><i className="fa-brands fa-tiktok"></i></a>
                    <a href="#" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
                </div>
            </div>
        </motion.div>
    );
};

export default HamburgerMenu;
