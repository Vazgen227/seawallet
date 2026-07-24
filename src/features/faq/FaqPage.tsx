import { useNavigate } from 'react-router-dom';
import s from './FaqPage.module.css';

const steps = [
    { emoji: '📱', title: 'iPhone / iPad', steps: ['Открой приложение в Safari', 'Нажми кнопку «Поделиться» (квадрат со стрелкой вверх)', 'Выбери «На экран «Домой»»', 'Нажми «Добавить»'] },
    { emoji: '🤖', title: 'Android', steps: ['Открой приложение в Chrome', 'Нажми три точки в правом верхнем углу', 'Выбери «Добавить на главный экран»', 'Нажми «Добавить»'] },
];

export default function FaqPage() {
    const navigate = useNavigate();

    return (
        <div className={s.page}>
            <div className={s.wrapper}>
                <button className={s.backBtn} onClick={() => navigate(-1)}>← Назад</button>

                <div className={s.hero}>
                    <div className={s.heroIcon}>⚓</div>
                    <h1 className={s.heroTitle}>SeaWallet</h1>
                    <p className={s.heroSub}>Финансовый помощник моряка</p>
                </div>

                <div className={s.card}>
                    <h2 className={s.cardTitle}>Что это?</h2>
                    <p className={s.cardText}>
                        SeaWallet — бесплатный инструмент для моряков. Помогает считать зарплату по контракту,
                        конвертировать валюты, отслеживать расходы в рейсе и следить за сроками документов.
                        Никаких аккаунтов, никаких серверов — все данные хранятся только на твоём телефоне.
                    </p>
                </div>

                <div className={s.card}>
                    <h2 className={s.cardTitle}>Почему бесплатно?</h2>
                    <p className={s.cardText}>
                        Потому что это должно существовать. Моряки заслуживают нормальных инструментов,
                        а не Excel-таблиц и калькулятора. MVP бесплатный навсегда —
                        в будущем появятся дополнительные платные функции, но базовое останется бесплатным.
                    </p>
                </div>

                <div className={s.card}>
                    <h2 className={s.cardTitle}>Модули</h2>
                    <div className={s.moduleList}>
                        <div className={s.moduleItem}>
                            <span className={s.moduleIcon}>📋</span>
                            <div>
                                <div className={s.moduleName}>Контракт</div>
                                <div className={s.moduleDesc}>Ставка, прогресс, прогноз заработка</div>
                            </div>
                        </div>
                        <div className={s.moduleItem}>
                            <span className={s.moduleIcon}>💱</span>
                            <div>
                                <div className={s.moduleName}>Валюта</div>
                                <div className={s.moduleDesc}>Конвертер с реальными курсами + история</div>
                            </div>
                        </div>
                        <div className={s.moduleItem}>
                            <span className={s.moduleIcon}>💸</span>
                            <div>
                                <div className={s.moduleName}>Расходы</div>
                                <div className={s.moduleDesc}>Трекер трат в рейсе, остаток от аванса</div>
                            </div>
                        </div>
                        <div className={s.moduleItem}>
                            <span className={s.moduleIcon}>📄</span>
                            <div>
                                <div className={s.moduleName}>Чек-лист</div>
                                <div className={s.moduleDesc}>Документы и их сроки, задачи перед рейсом</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={s.card}>
                    <h2 className={s.cardTitle}>Установить на телефон</h2>
                    <p className={s.cardText}>SeaWallet работает как обычное приложение — без App Store и Google Play.</p>
                    <div className={s.installList}>
                        {steps.map(platform => (
                            <div key={platform.title} className={s.installBlock}>
                                <div className={s.installTitle}>{platform.emoji} {platform.title}</div>
                                <ol className={s.installSteps}>
                                    {platform.steps.map((step, i) => (
                                        <li key={i} className={s.installStep}>
                                            <span className={s.stepNum}>{i + 1}</span>
                                            <span>{step}</span>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={s.footer}>
                    <p className={s.footerText}>Сделано моряком для моряков 🌊</p>
                    <p className={s.footerVersion}>v1.0.0 MVP</p>
                </div>
            </div>
        </div>
    );
}