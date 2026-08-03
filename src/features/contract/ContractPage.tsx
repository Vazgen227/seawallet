import { useContractStore } from "../../app/store/useContractStore";
import { useState } from "react";
import type { Currency } from "../../types/types";
import { useTranslation } from "react-i18next";
import {
  daysElapsed,
  daysLeft,
  progressPercent,
  earnedToDate,
  projectedTotal,
} from "./ContractMath";
import s from "./ContractPage.module.css";

export default function ContractPage() {
  const [company, setCompany] = useState("");
  const [rank, setRank] = useState("");
  const [durationDays, setDurationDays] = useState("");
  const [dailyRate, setDailyRate] = useState("");
  const [currency, setCurrency] = useState<Currency>("usd");
  const [startDate, setStartDate] = useState("");
  const [overtimeRate, setOvertimeRate] = useState("");
  const [overtimeHoursPerMonth, setOvertimeHoursPerMonth] = useState("");
  const [bonus, setBonus] = useState("");

  const store = useContractStore();
  const addContract = store.addContract;
  const contracts = store.contracts;
  const removeContract = store.removeContract;
  const currentContractId = store.currentContractId;
  const current = contracts.find((c) => c.id === currentContractId) ?? null;
  const setCurrentContractId = store.setCurrentContractId;
  const { t } = useTranslation();

  const handleAddContract = () => {
    if (!company || !dailyRate || !durationDays || !startDate) return;
    addContract({
      company,
      rank,
      durationDays: Number(durationDays),
      dailyRate: Number(dailyRate),
      currency,
      startDate,
      overtimeRate: overtimeRate ? Number(overtimeRate) : undefined,
      overtimeHoursPerMonth: overtimeHoursPerMonth
        ? Number(overtimeHoursPerMonth)
        : undefined,
      bonus: bonus ? Number(bonus) : undefined,
    });
    setBonus("");
    setCompany("");
    setRank("");
    setDurationDays("");
    setDailyRate("");
    setCurrency("usd");
    setStartDate("");
    setOvertimeRate("");
    setOvertimeHoursPerMonth("");
  };

  const elapsed = current ? daysElapsed(current) : 0;
  const left = current ? daysLeft(current) : 0;
  const progress = current ? progressPercent(current) : 0;
  const earned = current ? earnedToDate(current) : 0;
  const total = current ? projectedTotal(current) : 0;

  const safeElapsed = isNaN(elapsed) ? 0 : Math.max(0, elapsed);
  const safeLeft = isNaN(left) ? 0 : Math.max(0, left);
  const safeProgress = isNaN(progress) ? 0 : Math.min(100, Math.max(0, progress));
  const safeEarned = isNaN(earned) ? 0 : Math.max(0, earned);
  const safeTotal = isNaN(total) ? 0 : Math.max(0, total);

  // Геометрия кольца-индикатора рейса
  const RADIUS = 58;
  const CIRC = 2 * Math.PI * RADIUS;
  const dashOffset = CIRC - (safeProgress / 100) * CIRC;

  // ФОРМА СОЗДАНИЯ
  if (contracts.length === 0 || current === null) {
    return (
        <section className={s.page}>
          <div className={s.wrapper}>
            <div className={s.header}>
              <p className={s.headerLabel}>{t('contract.newVoyageLabel')}</p>
              <h1 className={s.headerTitle}>{t('contract.formTitle')}</h1>
            </div>

            <div className={s.formCard}>
              <input
                  placeholder={t('contract.company')}
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className={s.input}
              />
              <input
                  placeholder={t('contract.rank')}
                  value={rank}
                  onChange={(e) => setRank(e.target.value)}
                  className={s.input}
              />
              <div className={s.grid2}>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={s.input}
                />
                <input
                    type="number"
                    inputMode="numeric"
                    placeholder={t('contract.durationDays')}
                    value={durationDays}
                    onChange={(e) => setDurationDays(e.target.value)}
                    className={s.inputMono}
                />
              </div>
              <div className={s.grid2}>
                <input
                    type="number"
                    inputMode="decimal"
                    placeholder={t('contract.dailyRate')}
                    value={dailyRate}
                    onChange={(e) => setDailyRate(e.target.value)}
                    className={s.inputMono}
                />
                <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as Currency)}
                    className={s.input}
                >
                  <option value="usd">USD</option>
                  <option value="eur">EUR</option>
                  <option value="rub">RUB</option>
                </select>
              </div>

              <div className={s.extraSection}>
                <p className={s.extraLabel}>{t('contract.extra')}</p>
                <input
                    type="number"
                    inputMode="decimal"
                    placeholder={t('contract.overtimeRate')}
                    value={overtimeRate}
                    onChange={(e) => setOvertimeRate(e.target.value)}
                    className={s.inputMono}
                />
                <input
                    type="number"
                    inputMode="numeric"
                    placeholder={t('contract.overtimeHours')}
                    value={overtimeHoursPerMonth}
                    onChange={(e) => setOvertimeHoursPerMonth(e.target.value)}
                    className={s.inputMono}
                />
                <input
                    type="number"
                    inputMode="decimal"
                    placeholder={t('contract.bonus')}
                    value={bonus}
                    onChange={(e) => setBonus(e.target.value)}
                    className={s.inputMono}
                />
              </div>

              <button onClick={handleAddContract} className={s.submitBtn}>
                {t('contract.create')}
              </button>
            </div>
          </div>
        </section>
    );
  }


  // ПРОСМОТР КОНТРАКТА
  return (
      <section className={s.page}>
        <div className={s.wrapperSpaced}>

          {contracts.length > 1 && (
              <div className={s.tabsRow}>
                {contracts.map((c) => (
                    <button
                        key={c.id}
                        onClick={() => setCurrentContractId(c.id)}
                        className={c.id === current.id ? s.tabBtnActive : s.tabBtn}
                    >
                      {c.company}
                    </button>
                ))}
              </div>
          )}

          <div className={s.headerCard}>
            <p className={s.headerCardLabel}>{t('contract.activeLabel')}</p>
            <h2 className={s.headerCardTitle}>{current.company}</h2>
            {current.rank && <p className={s.headerCardRank}>{current.rank}</p>}
          </div>

          <div className={s.ringCard}>
            <div className={s.ringWrap}>
              <svg viewBox="0 0 140 140" className={s.ringSvg}>
                <circle cx="70" cy="70" r={RADIUS} fill="none" stroke="var(--border-soft)" strokeWidth="9" />
                <circle
                    cx="70" cy="70" r={RADIUS} fill="none"
                    stroke="var(--text-accent)" strokeWidth="9" strokeLinecap="round"
                    strokeDasharray={CIRC} strokeDashoffset={dashOffset}
                    style={{ transition: "stroke-dashoffset 0.6s ease" }}
                />
              </svg>
              <div className={s.ringCenter}>
                <span className={s.ringElapsed}>{safeElapsed}</span>
                <span className={s.ringTotal}>{t('contract.daysOf')} {current.durationDays} {t('contract.days')}</span>
                <span className={s.ringPercent}>{safeProgress}%</span>
              </div>
            </div>
          </div>

          <div className={s.statsCard}>
            <div className={s.statRowLight}>
              <div>
                <p className={s.statLabel}>{t('contract.daysLeft')}</p>
                <p className={s.statValue}>
                  {safeLeft} <span className={s.statUnit}>{t('contract.days')}</span>
                </p>
              </div>
              <div className={s.textRight}>
                <p className={s.statLabel}>{t('contract.start')}</p>
                <p className={s.statValueSmall}>{current.startDate}</p>
              </div>
            </div>

            <div className={s.statRowDark}>
              <div>
                <p className={s.statLabelLight}>{t('contract.earned')}</p>
                <p className={s.statValueBig}>
                  {safeEarned} <span className={s.statCurrency}>{current.currency.toUpperCase()}</span>
                </p>
              </div>
              <div className={s.textRight}>
                <p className={s.statLabelLight}>{t('contract.totalContract')}</p>
                <p className={s.statValueBig}>
                  {safeTotal} <span className={s.statCurrency}>{current.currency.toUpperCase()}</span>
                </p>
              </div>
            </div>
          </div>

          <div className={s.actionsCard}>
            <button onClick={() => setCurrentContractId(null)} className={s.newVoyageBtn}>
              {t('contract.newVoyage')}
            </button>
            <button onClick={() => removeContract(current.id)} className={s.deleteBtn}>
              {t('contract.delete')}
            </button>
          </div>
        </div>
      </section>
  );
}