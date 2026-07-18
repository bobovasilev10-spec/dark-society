import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./PopularProducts.css";
import Product from "./Product";

const PopularProducts = ({ newProducts }) => {
    return (
        <section className="ds-products-section">
            <div className="ds-section-head">
                <div>
                    <p className="ds-eyebrow">Последният drop</p>
                    <h2>НОВИ ПРЕДЛОЖЕНИЯ</h2>
                </div>
                <a href="/category/teniski" className="ds-text-link">Виж всички продукти</a>
            </div>

            <Swiper
                className="ds-products-slider"
                modules={[Navigation, Pagination, A11y]}
                navigation
                pagination={{ clickable: true }}
                spaceBetween={18}
                slidesPerView={4}
                breakpoints={{
                    1280: { slidesPerView: 4 },
                    900: { slidesPerView: 3 },
                    560: { slidesPerView: 2 },
                    0: { slidesPerView: 1.15 },
                }}
            >
                {newProducts?.length > 0 && newProducts.map((product, index) => (
                    <SwiperSlide key={index}>
                        <Product productData={product} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};

export default PopularProducts;
