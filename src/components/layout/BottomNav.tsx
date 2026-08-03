import { NavLink } from "react-router-dom";
import { FileText, Coins, Receipt, CheckSquare } from "lucide-react";
import s from "./BottomNav.module.css";
import { useTranslation } from 'react-i18next';


export default function BottomNav() {
    const { t } = useTranslation();

    const tabs = [
        { to: "/contract", label: t('nav.contract'), icon: FileText },
        { to: "/currency", label: t('nav.currency'), icon: Coins },
        { to: "/expenses", label: t('nav.expenses'), icon: Receipt },
        { to: "/checklist", label: t('nav.checklist'), icon: CheckSquare },
    ];
  return (
    <nav className={s.nav}>
      <ul className={s.list}>
        {tabs.map(({ to, label, icon: Icon }) => (
          <li key={to} className={s.listItem}>
            <NavLink to={to} className={s.link}>
              {({ isActive }) => (
                <div className={isActive ? s.tabContentActive : s.tabContent}>
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2.5 : 1.8}
                    className={s.icon}
                  />
                  <span className={isActive ? s.labelActive : s.label}>
                    {label}
                  </span>
                </div>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}