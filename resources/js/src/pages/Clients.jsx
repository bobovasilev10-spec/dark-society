import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ReactBeforeSliderComponent from "react-before-after-slider-component";
import "react-before-after-slider-component/dist/build.css";

import * as baseService from "../services/baseService";
import Loader from "../components/utils/Loader";
import { useLanguage } from "../contexts/LanguageContext";

import parse from "html-react-parser";
export default function Clients() {
    const { t } = useTranslation();
    const {language} = useLanguage();
    const [clientsData, setClientsData] = useState(null);
    const [loading, setLoading] = useState(null);

    useEffect(() => {
        setLoading(true);
        baseService
            .getClientsData()
            .then((result) => {
                if (result.success) {
                    setClientsData(result.data);
                }
            })
            .catch(() => {
                setClientsData([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="bg-back py-8">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold text-white text-center py-4">
                    {t("Results achieved by our clients")}
                </h2>
                {clientsData &&
                    clientsData.map((client, index) => (
                        <div
                            className={` mx-auto flex flex-wrap lg:flex-nowrap items-center gap-8 py-8 ${
                                index % 2 === 0
                                    ? "flex-row"
                                    : "flex-row-reverse"
                            }`}
                            key={client.id}
                        >
                            <div className="w-full lg:w-1/2">
                                <img src={`/storage/${client.image_before}`} alt="client img" />
                                {/* <ReactBeforeSliderComponent
                                    firstImage={{
                                        imageUrl: `/storage/${client.image_before}`,
                                    }}
                                    secondImage={{
                                        imageUrl: `/storage/${client.image_after}`,
                                    }}
                                /> */}
                            </div>
                            <div
                                className={`w-full lg:w-1/2 bg-transparent p-4 flex flex-col justify-between`}
                            >
                                <div className="mb-8">
                                    <h3 className="text-[#C13584] font-bold text-2xl mb-2">
                                        {client.name?.[language]}
                                    </h3>
                                    <p
                                        className="description text-white"
                                    >
                                        {client.description?.[language] &&
                                            parse(
                                                client.description?.[language]
                                            )}
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    <div className="text-sm">
                                        <p className="text-white leading-none">
                                            {client.weight_loss
                                                ? t("Weight Loss")
                                                : t("Muscle Gain")}
                                        </p>
                                        <p className="text-[#C13584] py-2">
                                            {client.weight_loss
                                                ? client.weight_loss
                                                : client.weight_gain}{" "}
                                            кг.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}
