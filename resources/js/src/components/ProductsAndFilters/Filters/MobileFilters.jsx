import { motion } from "framer-motion";

import Categories from "./AllCategories/Allcategories";
import PriceFilter from "./PriceFilter";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

const MobileFilters = ({ productData, showFiltersHandler, filterHandler, categories }) => {
    const modalRef = useRef(null);

    const { t } = useTranslation();

    const viewHandler = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            handleClickOutside(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 bg-black bg-opacity-10 z-30" 
            onClick={viewHandler}
        >
            <div ref={modalRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-auto w-[90%] h-[50%] lg:w-[1000px] lg:h-[500px] bg-black p-3 order-2 border-2 border-white rounded-xl shadow-[0_10px_50px_rgba(255,255,255,0.3)]">
                <div className="flex justify-end">
                    <span className="text-2xl uppercase pr-2" onClick={() => showFiltersHandler(false)}>X</span>
                </div>

                {productData.length > 10 && <PriceFilter productData={productData} filterHandler={filterHandler}/> }

                <div className="">
                    <span className="text-3xl font-semibold text-white underline underline-offset-8">
                        {t('Categories')}
                    </span>
                    <Categories categories={categories}/>
                </div>
            </div>
        </motion.div>
    );
}


export default MobileFilters;
