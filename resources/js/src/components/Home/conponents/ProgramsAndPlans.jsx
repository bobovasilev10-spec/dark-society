import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { toast } from 'react-toastify';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';
import { useTranslation } from 'react-i18next';

import { useCart } from '../../../contexts/CartContext';
import { useLanguage } from '../../../contexts/LanguageContext';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/autoplay';

const ProgramsAndPlans = ({ subcriptions }) => {
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const { language } = useLanguage();
    const { t } = useTranslation();
    const handleOrderFinish = () => {
        toast.dismiss();
        navigate("/cart");
    };
    
    const handleAddToCart = (item, qty) => { 
        addToCart(null, qty, '', item.id);
        toast.success(
            <div>
                <p>{`Успешно добавихте ${item.name[language]} в количката.`}</p>
                <div className="flex justify-center">
                    <button
                        onClick={handleOrderFinish}
                        className="button-86"
                    >
                        {t('Checkout')}
                    </button>
                </div>
            </div>,
            {autoClose: 2000}
        );
    };
    

    return (
        <div>
            <h1 className='text-center text-3xl xl:text-5xl font-bold underline underline-offset-8 text-white uppercase'>{t('Plans')}</h1>
            <div className='planove py-10 xl:py-20 mx-10 xl:w-2/3 xl:mx-auto '>
                <Swiper
                    modules={[Pagination,Navigation, A11y]}
                    pagination={{ clickable: true }}
                    autoplay={{
                        delay: 0,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true
                    }}
                    spaceBetween={30}
                    slidesPerView={3}
                    breakpoints={{
                        1540: { slidesPerView: 3 },
                        1280: { slidesPerView: 3 },
                        1024: { slidesPerView: 2.3 },
                        770: { slidesPerView: 2 },
                        500: { slidesPerView: 1.5 },
                        420: { slidesPerView: 1.1 },
                        0: { slidesPerView: 1 }
                    }}
                >
                    {subcriptions?.length > 0 && subcriptions.map((item, index) => (
                        <SwiperSlide key={index} >
                            <div className="relative asd cursor-pointer">
                                <a href={`/subscription/${item.slug}`}>
                                    <img 
                                        className="absolute top-0 left-0 object-cover h-full w-full rounded-xl cursor-pointer opacity-80 hover:opacity-100 transition ease-in-out delay-50 duration-500 hover:shadow-[0_10px_50px_rgba(255,255,255,0.3)]" 
                                        src={`/storage/${item?.image}`} 
                                        alt="Training" 
                                    />
                                </a>
                                <div className='absolute bottom-0 w-full h-3/6 md:h-2/6 bg-black bg-opacity-70 rounded-b-xl'>
                                    <div className='h-full flex flex-col items-center justify-center text-white'>
                                        <h3 className='text-center text-white text-lg cursor-default uppercase px-10 text-center'>{item?.name[language]}</h3>
                                        {item.promo_price > 0 ? (
                                            <div className="flex flex-col items-center text-sm">
                                                <span className="line-through decoration-2 text-red-500">
                                                    {t("Price")}: {Number(item?.price).toFixed(2)} €
                                                </span>
                                                <span className="text-gray-400">
                                                    
                                                </span>

                                                <span>
                                                    {t("Price")}: {Number(item?.promo_price).toFixed(2)} €
                                                </span>
                                                <span className="text-gray-400">
                                                    
                                                </span>
                                            </div>
                                            ) : (
                                            <div className="flex flex-col items-center text-sm">
                                                <p>
                                                    {t("Price")}: {Number(item?.price).toFixed(2)} €
                                                </p>
                                                <span className="text-gray-400">
                                                    
                                                </span>
                                            </div>
                                        )}
                                        <div className='flex justify-center'>
                                            <button className='button-86' onClick={() => handleAddToCart(item, 1)}>
                                                {t('Buy')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

        </div>
    )
}

export default ProgramsAndPlans;