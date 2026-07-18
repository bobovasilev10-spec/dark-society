import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import Loader from "../components/utils/Loader";

import { useLanguage } from "../contexts/LanguageContext";
import * as baseService from "../services/baseService";

import parse from "html-react-parser";
export default function MedicalTeams() {
    const { t } = useTranslation();
    const { language } = useLanguage();

    const [MediacalData, setMedicalData] = useState(null);
    const [loading, setLoading] = useState(null);

    useEffect(() => {
        setLoading(true);
        baseService
            .getMedicalData()
            .then((result) => {
                if (result.success) {
                    setMedicalData(result.data);
                }
            })
            .catch(() => {
                setMedicalData([]);
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
                {MediacalData &&
                    MediacalData.map((medic, index) => (
                        <div
                            key={index}
                            className={`${
                                index > 0 ? "mt-10 border-t-2 pt-10" : ""
                            } 2xl:grid grid-cols-2`}
                        >
                            <div className="float-left 2xl:float-none w-[40%] 2xl:w-[80%] mr-5">
                                <img
                                    className="w-full rounded-xl"
                                    src={`/storage/${medic.image}`}
                                    alt={medic.name[language]}
                                />
                            </div>
                            <div>
                                <div className="text-center">
                                    <h3 className="text-2xl font-bold text-white">
                                        {medic.name[language]}
                                    </h3>
                                    <p className="text-white">
                                        {medic.specialization[language]}
                                    </p>
                                </div>
                                <div
                                    className="text-lg px-3 text-white"
                                >
                                    {medic?.content[language] &&
                                        parse(medic?.content[language])}
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}
