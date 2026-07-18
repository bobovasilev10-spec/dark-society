import { useEffect, useState } from "react";

import useDebounce from "../../../hooks/useDebounce";

import * as econtService from "../../../services/econtService";
import { useTranslation } from "react-i18next";
export default function EcontAddress({
    formData,
    handleChange,
    handleEcontStates,
    setDeliveryFee,
}) {
    const { t } = useTranslation();
    const [cities, setCities] = useState([]);
    const [streets, setStreets] = useState([]);
    const [isCityInputFocused, setIsCityInputFocused] = useState(false);
    const [isStreetInputFocused, setIsStreetInputFocused] = useState(false);

    const econtCity = useDebounce(formData?.econt_city, 500);
    const econtStreet = useDebounce(formData?.econt_street, 500);

    useEffect(() => {
        if (formData.econt_city_id && econtStreet) {
            getStreets();
        }
    }, [econtStreet]);
    useEffect(() => {
        if (econtCity) {
            getCities();
        }
    }, [econtCity]);

    // Get cities
    const getCities = () => {
        econtService
            .getCities(econtCity)
            .then((res) => {
                setCities(res);
            })
            .catch((error) => {});
    };
    // Get streets
    const getStreets = () => {
        econtService
            .getStreets(formData.econt_city_id, econtStreet)
            .then((res) => {
                setStreets(res);
            })
            .catch((error) => {});
    };

    useEffect(() => {
        const data = {
            delivery_type: formData.delivery_type,
            delivery_data: {
                econt_city_id: formData.econt_city_id,
                econt_street_id: formData.econt_street_id,
                econt_street_number: formData.econt_street_number,
                delivery_type: formData.delivery_type,
            },
        };
        if (formData.econt_city_id != "" && formData.econt_street_id != "") {
            econtService
                .calculateDelivery(data)
                .then((res) => {
                    if (res.success) {
                        setDeliveryFee(res.deliveryFee.toFixed(2));
                    } else {
                        toast.error(res.message);
                    }
                })
                .catch((error) => {});
        }
    }, [formData.econt_street_id, formData.econt_city_id]);
    return (
        <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
                <input
                    name="econt_city"
                    value={formData.econt_city}
                    onFocus={() => setIsCityInputFocused(true)}
                    onBlur={() =>
                        setTimeout(() => setIsCityInputFocused(false), 200)
                    }
                    onChange={handleChange}
                    required
                    type="text"
                    id="phone"
                    className="px-4 py-3 bg-transparent text-white w-full text-sm rounded-md  focus:outline-none focus:ring-white focus:border-white"
                    placeholder={t("City")}
                />
                {isCityInputFocused && cities.length > 0 && (
                    <ul
                        className="absolute max-h-[250px] overflow-y-auto z-10 max-w-full w-full bg-dark-blur border border-white text-white rounded-md shadow-lg p-2 mt-1"
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
                    name="econt_street"
                    value={formData.econt_street}
                    onChange={handleChange}
                    onFocus={() => setIsStreetInputFocused(true)}
                    onBlur={() =>
                        setTimeout(() => setIsStreetInputFocused(false), 200)
                    }
                    required
                    type="text"
                    id="phone"
                    className="px-4 py-3 bg-transparent text-white w-full text-sm rounded-md  focus:outline-none focus:ring-white focus:border-white"
                    placeholder={t("Address")}
                />
                {isStreetInputFocused && streets.length > 0 && (
                    <ul
                        className="absolute max-h-[250px] overflow-y-auto z-10 max-w-full w-full bg-dark-blur border border-white text-white rounded-md shadow-lg p-2 mt-1"
                        role="listbox"
                        aria-expanded="false"
                    >
                        {streets.map((street) => (
                            <li
                                className="hover:text-[#C13584] cursor-pointer text-lg"
                                key={street.econt_street_id}
                                onClick={() =>
                                    handleEcontStates({
                                        econt_street_id: street.econt_street_id,
                                        econt_street: street.name,
                                    })
                                }
                            >
                                <a
                                    tabIndex={0}
                                    className=""
                                    role="option"
                                    aria-selected="true"
                                >
                                    <span className="text">{street.name}</span>
                                    <span className="glyphicon glyphicon-ok check-mark" />
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="form-group block-inline col-lg-4">
                <input
                    name="econt_street_number"
                    value={formData.econt_street_number}
                    onChange={handleChange}
                    required
                    type="text"
                    id="phone"
                    className="px-4 py-3 bg-transparent text-white w-full text-sm rounded-md  focus:outline-none focus:ring-white focus:border-white"
                    placeholder={t("Street number")}
                />
            </div>
        </div>
    );
}
