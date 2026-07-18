
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { getSearchResults } from "../../../services/productService";
import useDebounce from "../../../hooks/useDebounce";
import { useLanguage } from "../../../contexts/LanguageContext";
import { useTranslation } from "react-i18next";


const SearchModal = ({ handleClickOutside, new_products }) => {
    const [ search, setSearch ] = useState('');
    const [ searchResults, setSearchResults ] = useState(new_products);

    const searchValue = useDebounce(search, 500);
    const modalRef = useRef(null);

    const { language } = useLanguage();
    const { t } = useTranslation();

    useEffect(() => {
        if (searchValue) {
            searchHandler();
        }
    }, [searchValue]);
    const viewHandler = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            handleClickOutside('search');
        }
    };

    async function searchHandler() {

        try {
            const result = await getSearchResults({ search: searchValue });
            if (result.success) {
                setSearchResults(result.products);
            }
        } catch (error) {}
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 bg-black bg-opacity-80 z-30"
            onClick={viewHandler}
        >
            <div
                ref={modalRef}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-auto w-[90%] h-[65%] lg:w-[1000px] lg:h-[500px] bg-black py-5 sm:p-5 order-2 border-2 border-white rounded-xl shadow-[0_10px_50px_rgba(255,255,255,0.3)]"
            >
                <h2
                    className="text-center text-3xl text-black text-white"
                    id="modal-modal-title"
                >
                    {t("Search")}
                </h2>
                <div className="mt-2 border-b-2 border-white rounded-xl mx-4">
                    <input
                        className="text-2xl py-2 px-3 rounded-full bg-black border-none  mt-2 w-full text-center text-white"
                        type="text"
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}
                        placeholder={t("Search")}
                    />
                </div>
                {searchResults.length > 0 && (
                    <div className="mt-5 bg-black rounded-xl p-3">
                        <ul className="h-72 overflow-y-scroll">
                            {searchResults.map((item, index) => (
                                <li
                                    key={index}
                                    className="sm:mx-6 pb-3 hover:border-b-2 border-gray-600 hover:font-bold mb-2"
                                >
                                    <a href={`/product/${item.slug}`}>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-5 text-white">
                                                {item.image?.endsWith(
                                                    ".mp4"
                                                ) ? (
                                                    <video
                                                        className="cursor-pointer w-[150px] object-cover rounded-xl"
                                                        autoPlay
                                                        loop
                                                        muted
                                                        playsInline
                                                        preload="auto"
                                                    >
                                                        <source
                                                            src={`/starage/${item.image}`}
                                                            type="video/mp4"
                                                        />
                                                        Вашият браузър не
                                                        поддържа видео елемента.
                                                    </video>
                                                ) : (
                                                    <img
                                                        className="rounded-xl"
                                                        src={`/storage/${item.image}`}
                                                        width={150}
                                                        height={100}
                                                        alt={
                                                            item.name[language]
                                                        }
                                                        style={{
                                                            height: "120px",
                                                        }}
                                                    />
                                                )}
                                                <p className="text-2xl ">
                                                    {item.name[language]}
                                                </p>
                                            </div>
                                        </div>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <div
                    className="absolute top-0 right-5 text-4xl text-white hover:text-red-500 cursor-pointer"
                    onClick={() => handleClickOutside("search")}
                >
                    <span>x</span>
                </div>
            </div>
        </motion.div>
    );
}

export default SearchModal;
