import { useState } from "react";
import MobileFilters from "./MobileFilters";
import { useTranslation } from "react-i18next";



const TopFilters = ({ productData, productsCount, filterHandler, categories }) => {

    const [ dropdownMenu, setDropdowMenu ] = useState({ open: false, selected: 'Първо най-новите'});
    const [ showFilters, setShowFilters ] = useState(false);

    const { t } = useTranslation();

    function showFiltersHandler(action) {
        action ? setShowFilters(true) : setShowFilters(false);
    }

    function selectedFilter(params) {
        setDropdowMenu({ open: false, selected: params });
        filterHandler({ filter: 'top-filter', params });
    }

    return (
        <div className="grid grid-cols-12 justify-end py-5">
            <div className="col-span-12 xl:col-span-8 xl:col-start-5 flex justify-center xl:justify-between px-4 xl:px-0">
                {/* <div className="hidden xl:block text-white">
                    <span className="text-lg">Намерени са {productsCount} резулта</span>
                </div> */}
                <div className="relative top_filters">
                    <div className="flex flex-col xl:flex-row gap-5 xl:gap-0 items-center xl:justify-between">
                        <div
                            className="flex gap-4 xl:hidden border-2 cursor-pointer border-white py-2 px-4 text-white rounded-xl items-center text-xl font-bold"
                            style={{ width: "150px" }}
                            onClick={() => showFiltersHandler(true)}
                            >
                            <img src='/icons/filter_alt.svg' alt="icons" />
                            <span>{t('Filters')}</span>
                        </div>
                        
                        {productData.length > 4 && (
                            <div
                                className="flex justify-between gap-5 border-2 cursor-pointer border-white py-2 px-4 text-white rounded-xl text-xl items-center"
                                onClick={() =>
                                    setDropdowMenu((prev) => ({
                                        ...prev,
                                        open: !prev.open,
                                    }))
                                }
                                style={{ width: "290px" }}
                            >
                                <span className="font-bold tracking-wide">
                                    {dropdownMenu.selected}
                                </span>
                                {dropdownMenu.open ? (
                                    <img src='/icons/keyboard_arrow_up.svg' alt="icons" />
                                ) : (
                                    <img src='/icons/keyboard_arrow_down.svg' alt="icons" />
                                )}
                            </div>
                        )}
                    </div>

                    {dropdownMenu.open && (
                        <div className="dropdown_menu absolute bottom-0 left-1/2 xl:left-0 bg-white p-4 rounded-xl z-20 text-black text-xl text-start tracking-wide item-center">
                            <ul>
                                <li
                                    className="cursor-pointer hover:underline py-1"
                                    onClick={() => selectedFilter("Първо най-скъпи") }
                                >
                                    {t('Highest price')}
                                </li>
                                <li
                                    className="cursor-pointer hover:underline py-1"
                                    onClick={() => selectedFilter("Първо най-евтините") }
                                    >
                                    {t('Lowest price')}
                                </li>
                                <li
                                    className="cursor-pointer hover:underline py-1"
                                    onClick={() => selectedFilter("Първо най-нови")}
                                >
                                    {t('Newest first')}
                                </li>
                            </ul>
                        </div>
                    )}
                </div>

                {showFilters && <MobileFilters productData={productData} categories={categories} showFiltersHandler={showFiltersHandler} filterHandler={filterHandler}/> }
            </div>
        </div>
    );
}

export default TopFilters;
