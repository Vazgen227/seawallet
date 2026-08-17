import { useNavigate } from 'react-router-dom';
import s from './FaqPage.module.css';
import { useTranslation } from 'react-i18next';

const MODULES = [
    { key: 'contract', icon: '📋' },
    { key: 'currency', icon: '💱' },
    { key: 'expenses', icon: '💸' },
    { key: 'checklist', icon: '📄' },
];

const PLATFORMS = [
    { emoji: '📱', key: 'ios' },
    { emoji: '🤖', key: 'android' },
];

export default function FaqPage() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div className={s.page}>
            <div className={s.wrapper}>
                <button className={s.backBtn} onClick={() => navigate(-1)}>
                    {t('faq.back')}
                </button>

                <div className={s.hero}>
                    <div className={s.heroIcon}>⚓</div>
                    <h1 className={s.heroTitle}>SeaWallet</h1>
                    <p className={s.heroSub}>{t('faq.subtitle')}</p>
                </div>

                <div className={s.card}>
                    <h2 className={s.cardTitle}>{t('faq.whatTitle')}</h2>
                    <p className={s.cardText}>{t('faq.whatText')}</p>
                </div>

                <div className={s.card}>
                    <h2 className={s.cardTitle}>{t('faq.whyTitle')}</h2>
                    <p className={s.cardText}>{t('faq.whyText')}</p>
                </div>

                <div className={s.card}>
                    <h2 className={s.cardTitle}>{t('faq.modulesTitle')}</h2>
                    <div className={s.moduleList}>
                        {MODULES.map(({ key, icon }) => (
                            <div key={key} className={s.moduleItem}>
                                <span className={s.moduleIcon}>{icon}</span>
                                <div>
                                    <div className={s.moduleName}>{t(`faq.modules.${key}.name`)}</div>
                                    <div className={s.moduleDesc}>{t(`faq.modules.${key}.desc`)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={s.card}>
                    <h2 className={s.cardTitle}>{t('faq.installTitle')}</h2>
                    <p className={s.cardText}>{t('faq.installText')}</p>
                    <div className={s.installList}>
                        {PLATFORMS.map(({ emoji, key }) => (
                            <div key={key} className={s.installBlock}>
                                <div className={s.installTitle}>
                                    {emoji} {t(`faq.${key}.title`)}
                                </div>
                                <ol className={s.installSteps}>
                                    {(t(`faq.${key}.steps`, { returnObjects: true }) as string[]).map((step, i) => (
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

                <div className={s.feedbackCard}>
                    <h2 className={s.feedbackTitle}>{t('faq.feedbackTitle')}</h2>
                    <p className={s.feedbackText}>{t('faq.feedbackText')}</p>
                    <a
                        href="https://t.me/velveteeeee"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={s.feedbackTgBtn}
                    >
                        <svg className={s.tgIcon} viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z" />
                        </svg>
                        <span>{t('faq.feedbackBtn')}</span>
                    </a>
                </div>

                <div className={s.footer}>
                    <p className={s.footerText}>{t('faq.footer')}</p>
                    <p className={s.footerVersion}>{t('faq.version')}</p>
                </div>
            </div>
        </div>
    );
}