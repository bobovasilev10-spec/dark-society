import "../../css/footer.css";

const Foter = () => {
    return (
        <footer className="ds-footer">
            <div className="ds-footer-top">
                <div className="ds-footer-brand">
                    
                    <h2>DARK SOCIETY</h2>
                    <p>За хората, които не търсят одобрение.</p>
                </div>

                <div className="ds-footer-links">
                    <div><h3>Магазин</h3><a href="/category/teniski">Всички продукти</a><a href="/category/teniski">Нова колекция</a><a href="/category/teniski">Тениски</a></div>
                    <div><h3>Информация</h3><a href="/about-us">За бранда</a><a href="/privacy-policy">Политика за поверителност</a><a href="/cookie-policy">Политика за бисквитки</a><a href="/terms-of-use">Общи условия</a></div>
                    <div><h3>Помощ</h3><a href="/contact">Контакти</a><a href="/delivery">Доставка</a><a href="/returns">Връщане</a></div>
                </div>

                <div className="ds-footer-social">
                    <h3>Следвай ни</h3>
                    <p>Нови drop-ове, задкулисни кадри и лимитирани модели.</p>
                    <div><a href="https://www.instagram.com/darksociety.wear" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a><a href="#" aria-label="TikTok"><i className="fa-brands fa-tiktok"></i></a><a href="#" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a></div>
                </div>
            </div>
            <div className="ds-footer-bottom">
                <span>© 2026 Dark Society. Всички права запазени.</span>
                <span>Създадено в България.</span>
            </div>
        </footer>
    );
};

export default Foter;
