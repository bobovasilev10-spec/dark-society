import { Link } from "react-router-dom";

export default function About() {
    return (
        <main className="ds-about">
            <section className="ds-about-hero">
                <div className="ds-about-overlay"></div>

                <img
                    className="ds-about-hero-image"
                    src="/images/hero/1.png"
                    alt="Dark Society"
                />

                <div className="ds-about-hero-content">
                    <span className="ds-about-kicker">
                        DARK SOCIETY
                    </span>

                    <h1>
                        Не е мода.
                        <br />
                        Това е идентичност.
                    </h1>

                    <p>
                        Създаден за хората, които не следват масата,
                        не търсят одобрение и изграждат собствен път.
                    </p>

                    <Link
                        className="ds-about-button"
                        to="/category/teniski"
                    >
                        Разгледай колекцията
                    </Link>
                </div>
            </section>

            <section className="ds-about-manifesto">
                <div className="ds-about-manifesto-heading">
                    <span>Манифест</span>
                    <h2>
                        За тези, които
                        <br />
                        се движат различно.
                    </h2>
                </div>

                <div className="ds-about-manifesto-copy">
                    <p>
                        Dark Society не е просто бранд за дрехи.
                        Това е отношение, присъствие и начин на мислене.
                    </p>

                    <p>
                        Вярваме в силния характер, свободата да бъдеш себе си
                        и смелостта да не се вписваш.
                    </p>
                </div>
            </section>

            <section className="ds-about-values">
                <article>
                    <span>01</span>
                    <h3>Идентичност</h3>
                    <p>
                        Дрехи със собствен характер, създадени да се отличават.
                    </p>
                </article>

                <article>
                    <span>02</span>
                    <h3>Присъствие</h3>
                    <p>
                        Изчистена визия с агресивно и запомнящо се усещане.
                    </p>
                </article>

                <article>
                    <span>03</span>
                    <h3>Без компромис</h3>
                    <p>
                        Всеки модел е част от цялостната идея на Dark Society.
                    </p>
                </article>
            </section>

            <section className="ds-about-quote">
                <p>
                    „Не следвай масата.
                    <br />
                    Създай собствен път.“
                </p>
            </section>

            <section className="ds-about-cta">
                <div>
                    <span>НОВА КОЛЕКЦИЯ</span>
                    <h2>Намери своя модел.</h2>
                </div>

                <Link
                    className="ds-about-button ds-about-button-light"
                    to="/category/teniski"
                >
                    Към магазина
                </Link>
            </section>
        </main>
    );
}