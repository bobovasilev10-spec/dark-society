import HeroSection from "./conponents/HeroSection";
import PopularProducts from "./conponents/PopularProducts/PopularProducts";

import "./Home.css";

export default function Home({ newProducts }) {
    return (
        <div className="home_container ds-home">
            <HeroSection />

            <section className="ds-manifesto-strip" aria-label="Манифест">
                <span>NO RULES</span><i></i><span>NO APPROVAL</span><i></i><span>NO LIMITS</span><i></i><span>DARK SOCIETY</span>
            </section>

            <PopularProducts newProducts={newProducts} />

            <section className="ds-categories">
                <div className="ds-section-head">
                    <div>
                        <p className="ds-eyebrow">Избери своя стил</p>
                        <h2>ПАЗАРУВАЙ ПО КАТЕГОРИЯ</h2>
                    </div>
                </div>
                <div className="ds-category-grid">
                    <a href="/category/teniski" className="ds-category-card ds-category-main">
                        <div className="ds-category-image ds-category-image-one"></div>
                        <div className="ds-category-copy"><span>Тениски</span><small>Разгледай</small></div>
                    </a>
                    <a href="/category/teniski" className="ds-category-card">
                        <div className="ds-category-image ds-category-image-two"></div>
                        <div className="ds-category-copy"><span>Суитшърти</span><small>Разгледай</small></div>
                    </a>
                    <a href="/category/teniski" className="ds-category-card">
                        <div className="ds-category-image ds-category-image-three"></div>
                        <div className="ds-category-copy"><span>Аксесоари</span><small>Разгледай</small></div>
                    </a>
                </div>
            </section>

            <section id="brand-story" className="ds-story">
                <div className="ds-story-media"></div>
                <div className="ds-story-content">
                    <p className="ds-eyebrow">За Dark Society</p>
                    <h2>НЕ Е ПРОСТО ДРЕХА.<br />ТОВА Е ИЗБОР.</h2>
                    <p>
                        Dark Society е създаден за хората, които избират собствения си път.
                        За онези, които не се вписват в готови рамки и не се страхуват да бъдат забелязани.
                    </p>
                    <a href="/about-us" className="ds-button ds-button-outline">Научи повече</a>
                </div>
            </section>

            <section className="ds-benefits">
                <article><i className="fa-solid fa-truck-fast"></i><div><h3>Бърза доставка</h3></div></article>
                <article><i className="fa-solid fa-shield-halved"></i><div><h3>Сигурно плащане</h3></div></article>
                <article><i className="fa-solid fa-rotate-left"></i><div><h3>Възможност за връщане</h3><p></p></div></article>
            </section>
        </div>
    );
}
