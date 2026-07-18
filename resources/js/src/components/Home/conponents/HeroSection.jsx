import { motion } from "framer-motion";
import { useState } from "react";

const HeroSection = () => {
    const [muted, setMuted] = useState(true);

    return (
        <section className="ds-hero">
            <img
                className="ds-hero-media ds-hero-desktop"
                src="/images/hero-urban.png"
                alt="Dark Society"
            />

            <img
                className="ds-hero-media ds-hero-mobile"
                src="/images/hero-urban.png"
                alt="Dark Society"
            />

            <div className="ds-hero-overlay"></div>

            <div className="ds-hero-content">
                <motion.p
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: .7, delay: .15 }}
                    className="ds-eyebrow"
                >
                    
                </motion.p>
                <motion.h1
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: .8, delay: .25 }}
                >
                    DARK<br />SOCIETY
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: .7, delay: .4 }}
                    className="ds-hero-copy"
                >
                    Дрехи за хората, които не търсят одобрение.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: .7, delay: .55 }}
                    className="ds-hero-actions"
                >
                    <a href="/category/teniski" className="ds-button ds-button-light">
                        Разгледай колекцията
                    </a>
                    
                </motion.div>
            </div>

            
            <span className="ds-scroll-hint">Превърти надолу</span>
        </section>
    );
};

export default HeroSection;
