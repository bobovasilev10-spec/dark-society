import { use, useEffect, useState } from "react";

import useDebounce from "../../../hooks/useDebounce";

import * as econtService from "../../../services/econtService";
import { useTranslation } from "react-i18next";
export default function EcontOffice({
    formData,
    handleChange,
    handleEcontStates,
    setDeliveryFee,
}) {
    const { t } = useTranslation();
    const [cities, setCities] = useState([]);
    const [offices, setOffices] = useState([]);
    const [isCityInputFocused, setIsCityInputFocused] = useState(false);
    const [isOfficeInputFocused, setIsOfficeInputFocused] = useState(false);

    const econtCity = useDebounce(formData.econt_city, 500);
    const econt_office = useDebounce(formData.econt_office, 500);

    useEffect(() => {
        if (econtCity) {
            getCities();
            if (formData.econt_city_id) {
                getOffices();
            }
        }
    }, [econtCity, econt_office]);

    // Get cities
    const getCities = () => {
        econtService
            .getCities(econtCity)
            .then((res) => {
                setCities(res);
            })
            .catch((error) => {
            });
    };
    // Get Offices
    const getOffices = () => {
        econtService
            .getOffices(formData.econt_city_id, econt_office)
            .then((res) => {
                setOffices(res);
            })
            .catch((error) => {
            });
    };

    useEffect(() => {
        const data = {
            delivery_type: formData.delivery_type,
            delivery_data: {
                econt_city_id: formData.econt_city_id,
                econt_office_id: formData.econt_office_id,
                delivery_type: formData.delivery_type,
            },
        };
        if (formData.econt_city_id != "" && formData.econt_office_id != "") {
            econtService
                .calculateDelivery(data)
                .then((res) => {
                    if (res.success) {
                        setDeliveryFee(res.deliveryFee.toFixed(2));
                    } else {
                        toast.error(res.message);
                    }
                })
                .catch((error) => {
                });
        }
    }, [formData.econt_office_id, formData.econt_city_id]);

    return (
        <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
                <input
                    required
                    name="econt_city"
                    value={formData.econt_city}
                    onFocus={() => setIsCityInputFocused(true)}
                    onBlur={() =>
                        setTimeout(() => setIsCityInputFocused(false), 200)
                    }
                    onChange={handleChange}
                    type="text"
                    id="phone"
                    placeholder={t("City")}
                    className="px-4 py-3 bg-transparent text-white w-full text-sm rounded-md  focus:outline-none focus:ring-white focus:border-white"
                />
                {isCityInputFocused && cities.length > 0 && (
                    <ul
                        className="absolute max-h-[250px] overflow-y-auto z-10 w-full bg-dark-blur border border-white text-white rounded-md shadow-lg p-2 mt-1"
                        role="listbox"
                        aria-expanded="false"
                    >
                        {cities.map((city) => (
                            <li
                                className="hover:text-[#C13584] cursor-pointer text-lg"
                                key={city.econt_city_id}
                                onClick={() =>
                                    handleEcontStates({
                                        econt_city: city.name,
                                        econt_city_id: city.econt_city_id,
                                    })
                                }
                            >
                                <a
                                    tabIndex={0}
                                    className=""
                                    role="option"
                                    aria-selected="true"
                                >
                                    <span className="text">{city.name}</span>
                                    <span className="glyphicon glyphicon-ok check-mark" />
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="relative">
                <input
                    name="econt_office"
                    value={formData.econt_office}
                    onChange={handleChange}
                    onFocus={() => setIsOfficeInputFocused(true)}
                    onBlur={() =>
                        setTimeout(() => setIsOfficeInputFocused(false), 200)
                    }
                    required
                    readOnly={formData.econt_city_id ? false : true}
                    type="text"
                    id="phone"
                    className="px-4 py-3 bg-transparent text-white w-full text-sm rounded-md  focus:outline-none focus:ring-white focus:border-white"
                    placeholder={t("Office")}
                />
                {isOfficeInputFocused && offices.length > 0 && (
                    <ul
                        className="absolute max-h-[250px] overflow-y-auto z-10 max-w-full w-full bg-dark-blur border border-white text-white rounded-md shadow-lg p-2 mt-1"
                        role="listbox"
                        aria-expanded="false"
                    >
                        {offices.map((office) => (
                            <li
                                className="hover:text-[#C13584] cursor-pointer text-lg"
                                key={office.econt_office_id}
                                onClick={() =>
                                    handleEcontStates({
                                        econt_office_id: office.econt_office_id,
                                        econt_office: office.name,
                                    })
                                }
                            >
                                <a
                                    tabIndex={0}
                                    className=""
                                    role="option"
                                    aria-selected="true"
                                >
                                    <span className="text">{office.name}</span>
                                    <span className="glyphicon glyphicon-ok check-mark" />
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
