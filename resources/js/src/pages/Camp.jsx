import { useTranslation } from "react-i18next";
import { campRequest } from "../services/baseService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Camp() {

    const { t } = useTranslation();
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        campRequest(data)
            .then((res) => {
                if (res.success) {
                    toast.success(t('Your inquiry was sent successfully! We will get in touch with you as soon as possible.'));
                    navigate('/');
                } else {
                    toast.error(t('There was an issue sending your inquiry. Please try again later.'));
                }
            })
            .catch((err) => {
                toast.error(t('There was an issue sending your inquiry. Please try again later.'));
            })
    };

    return (
        <div className="relative">
            <img className="relative w-full h-[100vh] filter brightness-50 object-cover" src="/camp.webp" width={100} height={100} alt="camp" />
            <div className="absolute top-2 md:top-1/2 left-1/2 -translate-x-1/2  md:-translate-y-2/3 w-[90%] md:w-[70%] lg:w-[53%] xl:w-[25%] mx-auto text-white">
                    <h2 className="text-5xl tracking-widest font-bold mb-4 md:mb-20 text-center uppercase">Yoloony Camp</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:gap-5">
                        <div>
                            {/* <label htmlFor="name" className="block text-lg font-semibold mb-2">{t('Name')}</label> */}
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                className="w-full text-center text-xl p-3 border rounded-xl border-white focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent placeholder-white "
                                placeholder={t('Enter your names')}
                            />
                        </div>

                        <div>
                            {/* <label htmlFor="phone" className="block text-lg font-semibold mb-2">{t('Phone number')}</label> */}
                            <input
                                type="number"
                                id="phone"
                                name="phone"
                                required
                                className="w-full text-center text-xl p-3 border rounded-xl border-white focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent placeholder-white "
                                placeholder={t('Enter your phone number')}
                            />
                        </div>

                        <div>
                            {/* <label htmlFor="age" className="block text-lg font-semibold text mb-2 text-black">{t('Age')}</label> */}
                            <input
                            type="number"
                            id="age"
                            name="age"
                            required
                            className="w-full text-center text-xl p-3 border rounded-xl border-white focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent placeholder-white "
                            placeholder={t('Enter your age')}
                            />
                        </div>

                        <div>
                            {/* <label htmlFor="email" className="block text-lg font-semibold mb-2">{t('Email')}</label> */}
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                className="w-full text-center text-xl p-3 border rounded-xl border-white focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent placeholder-white "
                                placeholder={t('Enter your email address')}
                            />
                        </div>

                        <div className="flex justify-center">
                            <button type="submit" className="button-86">{t('Send')}</button>
                        </div>
                    </form>
            </div>
        </div>
    );
  }
