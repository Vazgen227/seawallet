import { useState } from "react";
import { useCurrencyStore } from "./currency/useCurrencyStore";
import type { Currency } from "../types/types";
import s from "./CurrencyPage.module.css";
import { useTranslation } from "react-i18next";

const CURRENCIES: { value: Currency; label: string }[] = [
  { value: "usd", label: "USD" },
  { value: "eur", label: "EUR" },
  { value: "uah", label: "UAH" },
  { value: "inr", label: "INR" },
  { value: "php", label: "PHP" },
  { value: "aed", label: "AED" },
  { value: "gbp", label: "GBP" },
];

export default function CurrencyPage() {
  const [amount, setAmount] = useState("");
  const [from, setFrom] = useState<Currency>("usd");
  const [to, setTo] = useState<Currency>("eur");
  const [rotation, setRotation] = useState(0);
  const [isSwapping, setIsSwapping] = useState(false);

  const store = useCurrencyStore();
  const isLoading = store.isLoading;
  const error = store.error;
  const lastResult = store.lastResult;
  const history = store.history;
  const convert = store.convert;
  const clearHistory = store.clearHistory;
  const { t } = useTranslation();

  const handleConvert = () => {
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) return;
    convert(parsed, from, to);
  };

  const handleSwap = () => {
    if (isSwapping) return;
    setIsSwapping(true);
    setRotation((prev) => prev + 180);

    setTimeout(() => {
      setFrom(to);
      setTo(from);
      
      if (lastResult && lastResult.from === from && lastResult.to === to) {
        const newAmount = lastResult.result.toFixed(2);
        setAmount(newAmount);
        convert(parseFloat(newAmount), to, from);
      }
      
      setIsSwapping(false);
    }, 380);
  };

  return (
      <section className={s.page}>
        <div className={s.wrapper}>

          <div className={s.header}>
            <p className={s.headerLabel}>{t('currency.title')}</p>
            <h1 className={s.headerTitle}>{t('currency.mainTitle')}</h1>
          </div>

          {isLoading && (
              <div className={s.loadingOverlay}>
                <div className={s.spinner} />
                {t('currency.Convert')}…
              </div>
          )}

          {error && <div className={s.errorBox}>⚠ {error}</div>}

          <div className={s.converterCard}>
            <p className={s.fieldLabel}>{t('currency.imGivingAway')}</p>
            <div className={`${s.currencyRow} ${isSwapping ? s.rowAnimateDown : ""}`}>
              <input
                  type="number"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={s.amountInput}
              />
              <select
                  value={from}
                  onChange={(e) => setFrom(e.target.value as Currency)}
                  className={s.currencySelect}
              >
                {CURRENCIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div className={s.swapRow}>
              <div className={s.swapLine} />
              <button
                  className={s.swapBtn}
                  style={{ transform: `rotate(${rotation}deg)` }}
                  onClick={handleSwap}
              >
                ⇅
              </button>
            </div>

            <p className={s.fieldLabel}>{t('currency.imReceiving')}</p>
            <div className={`${s.currencyRow} ${isSwapping ? s.rowAnimateUp : ""}`}>
              <input
                  type="text"
                  readOnly
                  placeholder="—"
                  value={
                    lastResult && lastResult.from === from && lastResult.to === to
                        ? lastResult.result.toFixed(2)
                        : ""
                  }
                  className={s.amountInput}
              />
              <select
                  value={to}
                  onChange={(e) => setTo(e.target.value as Currency)}
                  className={s.currencySelect}
              >
                {CURRENCIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <button
                onClick={handleConvert}
                className={isLoading ? s.convertBtnDisabled : s.convertBtn}
            >
              {isLoading ? `${t('currency.Convert')}…` : t('currency.Convert')}
            </button>
          </div>

          {lastResult !== null && (
              <div className={s.resultCard}>
                <div className={s.resultRow}>
              <span className={s.resultFrom}>
                {lastResult.amount}
                <span className={s.resultCurrency}>{lastResult.from.toUpperCase()}</span>
              </span>
                  <span className={s.resultArrow}>→</span>
                  <span className={s.resultTo}>
                {lastResult.result.toFixed(2)}
                    <span className={s.resultCurrency}>{lastResult.to.toUpperCase()}</span>
              </span>
                </div>
                <div className={s.resultRate}>
                  <p className={s.resultRateLabel}>{t('currency.rate')}</p>
                  1 {lastResult.from.toUpperCase()} = {lastResult.rate.toFixed(4)} {lastResult.to.toUpperCase()}
                </div>
              </div>
          )}

          {history.length > 0 && (
              <div className={s.historySection}>
                <div className={s.historyHeader}>
                  <span className={s.historyTitle}>{t('expenses.history')}</span>
                  <button className={s.clearBtn} onClick={clearHistory}>
                    {t('currency.clearHistory')}
                  </button>
                </div>
                <ul className={s.historyList}>
                  {history.map((item) => (
                      <li key={item.id} className={s.historyItem}>
                  <span className={s.historyFrom}>
                    {item.amount}
                    <span className={s.historyCurrency}>{item.from.toUpperCase()}</span>
                  </span>
                        <span className={s.historyArrow}>→</span>
                        <span className={s.historyTo}>
                    {item.result.toFixed(2)}
                          <span className={s.historyCurrency}>{item.to.toUpperCase()}</span>
                  </span>
                        <span className={s.historyRate}>×{item.rate.toFixed(4)}</span>
                      </li>
                  ))}
                </ul>
              </div>
          )}

          {history.length === 0 && !lastResult && (
              <div className={s.emptyState}>
                <div className={s.emptyIcon}>💱</div>
                <p className={s.emptyText}>{t('currency.instructions')}</p>
              </div>
          )}

        </div>
      </section>
  );
}
