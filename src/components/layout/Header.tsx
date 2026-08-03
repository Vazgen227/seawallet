import { useThemeStore } from '../../app/store/useThemeStore';
import s from './Header.module.css';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Header() {
    const { theme, setTheme } = useThemeStore();
    const navigate = useNavigate();
    const { i18n } = useTranslation();

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
        localStorage.setItem('language', lang);
    };

    return (
        <header className={s.header}>
            <span className={s.logo}>⚓ SeaWallet</span>
            <button className={s.infoBtn} onClick={() => navigate('/faq')}>ℹ️</button>

            <div>
                <button onClick={() => changeLanguage('ru')}>RU</button>
                <button onClick={() => changeLanguage('en')}>EN</button>
                <button onClick={() => changeLanguage('uk')}>UA</button>
            </div>

            <div className={s.themeButtons}>
                <button
                    onClick={() => setTheme('light')}
                    className={theme === 'light' ? s.btnActive : s.btn}
                >☀️</button>
                <button
                    onClick={() => setTheme('system')}
                    className={theme === 'system' ? s.btnActive : s.btn}
                >🌐</button>
                <button
                    onClick={() => setTheme('dark')}
                    className={theme === 'dark' ? s.btnActive : s.btn}
                >🌙</button>
            </div>
        </header>
    );
}