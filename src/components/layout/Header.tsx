import { useThemeStore } from '../../app/store/useThemeStore';
import s from './Header.module.css';
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const { theme, setTheme } = useThemeStore();
    const navigate = useNavigate();

    return (
        <header className={s.header}>
            <span className={s.logo}>⚓ SeaWallet</span>
            <button className={s.infoBtn} onClick={() => navigate('/faq')}>ℹ️</button>
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