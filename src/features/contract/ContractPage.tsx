import { useContractStore } from "../../app/store/useContractStore";
import { useState } from "react";
import type { Currency } from "../../types/types";
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
            <p className={s.headerLabel}>Новый рейс</p>
            <h1 className={s.headerTitle}>Открыть контракт</h1>
          </div>

          <div className={s.formCard}>
            <input
              placeholder="Компания"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className={s.input}
            />
            <input
              placeholder="Должность"
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
                placeholder="Дней"
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
                className={s.inputMono}
              />
            </div>
            <div className={s.grid2}>
              <input
                type="number"
                inputMode="decimal"
                placeholder="Ставка/день"
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
              <p className={s.extraLabel}>Дополнительно</p>
              <input
                type="number"
                inputMode="decimal"
                placeholder="Ставка переработки"
                value={overtimeRate}
                onChange={(e) => setOvertimeRate(e.target.value)}
                className={s.inputMono}
              />
              <input
                type="number"
                inputMode="numeric"
                placeholder="Часы переработки / мес"
                value={overtimeHoursPerMonth}
                onChange={(e) => setOvertimeHoursPerMonth(e.target.value)}
                className={s.inputMono}
              />
              <input
                type="number"
                inputMode="decimal"
                placeholder="Бонус"
                value={bonus}
                onChange={(e) => setBonus(e.target.value)}
                className={s.inputMono}
              />
            </div>

            <button onClick={handleAddContract} className={s.submitBtn}>
              Создать контракт
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

        {/* Шапка — отдельная карточка */}
        <div className={s.headerCard}>
          <p className={s.headerCardLabel}>Действующий контракт</p>
          <h2 className={s.headerCardTitle}>{current.company}</h2>
          {current.rank && (
            <p className={s.headerCardRank}>{current.rank}</p>
          )}
        </div>

        {/* Кольцевой индикатор рейса */}
        <div className={s.ringCard}>
          <div className={s.ringWrap}>
            <svg viewBox="0 0 140 140" className={s.ringSvg}>
              <circle cx="70" cy="70" r={RADIUS} fill="none" stroke="var(--border-soft)" strokeWidth="9" />
              <circle
                cx="70"
                cy="70"
                r={RADIUS}
                fill="none"
                stroke="var(--text-accent)"
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray={CIRC}
                strokeDashoffset={dashOffset}
                style={{ transition: "stroke-dashoffset 0.6s ease" }}
              />
            </svg>
            <div className={s.ringCenter}>
              <span className={s.ringElapsed}>{safeElapsed}</span>
              <span className={s.ringTotal}>из {current.durationDays} дн.</span>
              <span className={s.ringPercent}>{safeProgress}%</span>
            </div>
          </div>
        </div>

        {/* Статистика */}
        <div className={s.statsCard}>
          <div className={s.statRowLight}>
            <div>
              <p className={s.statLabel}>Осталось</p>
              <p className={s.statValue}>
                {safeLeft} <span className={s.statUnit}>дн.</span>
              </p>
            </div>
            <div className={s.textRight}>
              <p className={s.statLabel}>Начало</p>
              <p className={s.statValueSmall}>{current.startDate}</p>
            </div>
          </div>

          <div className={s.statRowDark}>
            <div>
              <p className={s.statLabelLight}>Заработано</p>
              <p className={s.statValueBig}>
                {safeEarned} <span className={s.statCurrency}>{current.currency.toUpperCase()}</span>
              </p>
            </div>
            <div className={s.textRight}>
              <p className={s.statLabelLight}>Итого по контракту</p>
              <p className={s.statValueBig}>
                {safeTotal} <span className={s.statCurrency}>{current.currency.toUpperCase()}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Управление */}
        <div className={s.actionsCard}>
          <button
            onClick={() => setCurrentContractId(null)}
            className={s.newVoyageBtn}
          >
            Новый рейс
          </button>
          <button
            onClick={() => removeContract(current.id)}
            className={s.deleteBtn}
          >
            Удалить
          </button>
        </div>
      </div>
    </section>
  );
}