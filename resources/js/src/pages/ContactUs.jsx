import { useTranslation } from "react-i18next";
import { contactRequest } from "../services/baseService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ContactUs() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        contactRequest(data)
            .then((res) => {
                if (res.success) {
                    toast.success(
                        t(
                            "Вашето запитване беше изпратено успешно! Ще се свържем с вас възможно най-скоро."
                        )
                    );
                    navigate("/");
                }
            })
            .catch(() => {
                toast.error(
                    t(
                        "Възникна проблем при изпращането на запитването. Моля, опитайте отново по-късно."
                    )
                );
            });
    };

    return (
        <main className="min-h-screen bg-[#050505] text-white">
            <section className="relative min-h-[540px] overflow-hidden border-b border-white/10">
                <div className="absolute inset-0 bg-[url('/images/hero-urban.png')] bg-cover bg-center" />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/30" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/20" />

                <div className="relative z-10 mx-auto flex min-h-[540px] w-[90%] max-w-7xl items-end pb-16 pt-40 md:pb-20">
                    <div className="max-w-4xl">
                        <span className="mb-5 inline-block text-[11px] font-semibold uppercase tracking-[0.28em] text-white/50">
                            {t("Контакти")} / Dark Society
                        </span>

                        <h1 className="text-[clamp(4rem,9vw,8.5rem)] font-black uppercase leading-[0.82] tracking-[-0.06em]">
                            {t("Имате въпрос?")}
                            <span className="block text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.65)]">
                                {t("Свържете се с нас")}
                            </span>
                        </h1>

                        <p className="mt-8 max-w-2xl text-sm leading-7 text-white/60 md:text-base">
                            {t(
                                "Имате въпрос относно поръчка, размер, доставка или предстоящ дроп? Изпратете ни съобщение и ще ви отговорим възможно най-скоро."
                            )}
                        </p>
                    </div>
                </div>
            </section>

            <section className="relative overflow-hidden py-20 md:py-28">
                <div className="pointer-events-none absolute right-[-2rem] top-6 select-none text-[8rem] font-black uppercase leading-none tracking-[-0.08em] text-white/[0.02] md:text-[14rem] xl:text-[18rem]">
                    Contact
                </div>

                <div className="relative z-10 mx-auto grid w-[90%] max-w-7xl gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
                    <aside>
                        <div className="mt-12 border-t border-white/10">
                            <div className="flex flex-col gap-2 border-b border-white/10 py-5 sm:flex-row sm:items-center sm:justify-between">
                                <span className="text-[10px] uppercase tracking-[0.18em] text-white/35">
                                    {t("Време за отговор")}
                                </span>
                                <strong className="text-xs uppercase tracking-[0.12em]">
                                    {t("До 24–48 часа")}
                                </strong>
                            </div>

                            <div className="flex flex-col gap-2 border-b border-white/10 py-5 sm:flex-row sm:items-center sm:justify-between">
                                <span className="text-[10px] uppercase tracking-[0.18em] text-white/35">
                                    {t("Поддръжка")}
                                </span>
                                <strong className="text-xs uppercase tracking-[0.12em]">
                                    {t("Понеделник — Петък")}
                                </strong>
                            </div>

                            <div className="flex flex-col gap-2 border-b border-white/10 py-5 sm:flex-row sm:items-center sm:justify-between">
                                <span className="text-[10px] uppercase tracking-[0.18em] text-white/35">
                                    {t("Социални мрежи")}
                                </span>
                                <strong className="text-xs uppercase tracking-[0.12em]">
                                    @darksociety.wear
                                </strong>
                            </div>
                        </div>

                        <div className="mt-12 border-l-2 border-white pl-5 text-xl font-black uppercase leading-tight tracking-[-0.03em] md:text-3xl">
                            {t("Създадено в тъмнината.")}
                            <br />
                            {t("Носено по улиците.")}
                        </div>
                    </aside>

                    <div className="border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.015] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur-xl md:p-10 lg:p-12">
                        <div className="mb-10 flex items-start justify-between gap-6">
                            <h2 className="text-3xl font-black uppercase leading-none tracking-[-0.04em] md:text-5xl">
                                {t("Изпратете запитване")}
                            </h2>

                            <span className="pt-1 text-[11px] uppercase tracking-[0.22em] text-white/35">
                                02
                            </span>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-7">
                            <div className="grid gap-7 md:grid-cols-2">
                                <label className="block">
                                    <span className="mb-3 block text-[10px] font-bold uppercase tracking-[0.18em] text-white/55">
                                        {t("Име")}
                                    </span>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        className="w-full border-0 border-b border-white/20 bg-transparent px-0 py-4 text-white outline-none transition placeholder:text-white/20 focus:border-white focus:ring-0"
                                        placeholder={t("Въведете вашите имена")}
                                    />
                                </label>

                                <label className="block">
                                    <span className="mb-3 block text-[10px] font-bold uppercase tracking-[0.18em] text-white/55">
                                        {t("Имейл")}
                                    </span>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        className="w-full border-0 border-b border-white/20 bg-transparent px-0 py-4 text-white outline-none transition placeholder:text-white/20 focus:border-white focus:ring-0"
                                        placeholder={t("Въведете вашия имейл адрес")}
                                    />
                                </label>
                            </div>

                            <label className="block">
                                <span className="mb-3 block text-[10px] font-bold uppercase tracking-[0.18em] text-white/55">
                                    {t("Телефонен номер")}
                                </span>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    required
                                    className="w-full border-0 border-b border-white/20 bg-transparent px-0 py-4 text-white outline-none transition placeholder:text-white/20 focus:border-white focus:ring-0"
                                    placeholder={t("Въведете вашия телефонен номер")}
                                />
                            </label>

                            <label className="block">
                                <span className="mb-3 block text-[10px] font-bold uppercase tracking-[0.18em] text-white/55">
                                    {t("Вашето запитване")}
                                </span>
                                <textarea
                                    id="subject"
                                    name="subject"
                                    rows="6"
                                    required
                                    className="min-h-[160px] w-full resize-y border-0 border-b border-white/20 bg-transparent px-0 py-4 leading-7 text-white outline-none transition placeholder:text-white/20 focus:border-white focus:ring-0"
                                    placeholder={t(
                                        "Опишете с какво можем да помогнем. Ако запитването ви е свързано със съществуваща поръчка, добавете и нейния номер."
                                    )}
                                />
                            </label>

                            <div className="flex flex-col gap-5 pt-2 sm:flex-row sm:items-center">
                                <button
                                    type="submit"
                                    className="group inline-flex min-w-[220px] items-center justify-between gap-8 border border-white bg-white px-5 py-4 text-[11px] font-black uppercase tracking-[0.14em] text-black transition duration-200 hover:-translate-y-0.5 hover:bg-transparent hover:text-white"
                                >
                                    <span>{t("Изпрати запитване")}</span>
                                    
                                </button>

                                <p className="max-w-sm text-[10px] leading-5 text-white/30">
                                    {t(
                                        "С изпращането на формата се съгласявате да използваме предоставените данни единствено за отговор на вашето запитване."
                                    )}
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    );
}