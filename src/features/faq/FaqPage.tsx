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

                <div className={s.footer}>
                    <p className={s.footerText}>{t('faq.footer')}</p>
                    <p className={s.footerVersion}>{t('faq.version')}</p>
                </div>
            </div>
        </div>
    );
}