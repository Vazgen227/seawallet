import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../../app/store/useThemeStore';
import s from './Header.module.css';

function LangButtons() {
    const { i18n } = useTranslation();
    const currentLang = i18n.language;

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
        localStorage.setItem('language', lang);
    };

    return (
        <div className={s.langButtons}>
            <button
                type="button"
                onClick={() => changeLanguage('ru')}
                className={currentLang === 'ru' ? s.langBtnActive : s.langBtn}
            >
                RU
            </button>

            <button
                type="button"
                onClick={() => changeLanguage('en')}
                className={currentLang === 'en' ? s.langBtnActive : s.langBtn}
            >
                EN
            </button>

            <button
                type="button"
                onClick={() => changeLanguage('uk')}
                className={currentLang === 'uk' ? s.langBtnActive : s.langBtn}
            >
                UA
            </button>
        </div>
    );
}

function ThemeButtons() {
    const { theme, setTheme } = useThemeStore();

    return (
        <div className={s.themeButtons}>
            <button
                type="button"
                onClick={() => setTheme('light')}
                className={theme === 'light' ? s.btnActive : s.btn}
                aria-label="Light theme"
            >
                ☀️
            </button>

            <button
                type="button"
                onClick={() => setTheme('system')}
                className={theme === 'system' ? s.btnActive : s.btn}
                aria-label="System theme"
            >
                🌐
            </button>

            <button
                type="button"
                onClick={() => setTheme('dark')}
                className={theme === 'dark' ? s.btnActive : s.btn}
                aria-label="Dark theme"
            >
                🌙
            </button>
        </div>
    );
}

export default function Header() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const headerRef = useRef<HTMLElement>(null);

    // Закрытие по клику вне меню
    useEffect(() => {
        if (!menuOpen) return;

        const handlePointerDown = (event: PointerEvent) => {
            const target = event.target;

            if (target instanceof Node && headerRef.current && !headerRef.current.contains(target)) {
                setMenuOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setMenuOpen(false);
            }
        };

        document.addEventListener('pointerdown', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [menuOpen]);

    // Если ресайзнули на десктоп, закрываем мобилку
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 425) {
                setMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const headerClass = [s.header, menuOpen && s.headerOpen].filter(Boolean).join(' ');

    return (
        <header ref={headerRef} className={headerClass}>
            <span className={s.logo}>⚓ SeaWallet</span>

            <div className={s.headerRight}>
                <button
                    type="button"
                    className={s.infoBtn}
                    onClick={() => navigate('/faq')}
                    aria-label="FAQ"
                >
                    ℹ️
                </button>

                {/* Это один и тот же блок для desktop и mobile */}
                <div id="header-menu" className={s.controls}>
                    <LangButtons />
                    <ThemeButtons />
                </div>

                <button
                    type="button"
                    className={s.burgerButton}
                    onClick={() => setMenuOpen(prev => !prev)}
                    aria-expanded={menuOpen}
                    aria-controls="header-menu"
                    aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
                >
                    <span className={s.burgerBox} aria-hidden="true">
                        <span className={`${s.burgerLine} ${s.line1}`} />
                        <span className={`${s.burgerLine} ${s.line2}`} />
                        <span className={`${s.burgerLine} ${s.line3}`} />
                    </span>
                </button>
            </div>
        </header>
    );
}