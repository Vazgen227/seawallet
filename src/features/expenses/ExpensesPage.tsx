import { useExpensesStore } from "./useExpensesStore";
import { useState } from "react";
import type { ExpenseCategory, Currency } from "../../types/types";
import s from "./ExpensesPage.module.css";
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

export default function ExpensesPage() {
  const { t } = useTranslation();
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("food");
  const [currency, setCurrency] = useState<Currency>("usd");
  const [note, setNote] = useState("");

  // CATEGORIES внутри компонента — потому что t() это хук, работает только здесь
  const CATEGORIES: { value: ExpenseCategory; label: string }[] = [
    { value: "food", label: t('expenses.categories.food') },
    { value: "sim", label: t('expenses.categories.sim') },
    { value: "souvenirs", label: t('expenses.categories.souvenirs') },
    { value: "transport", label: t('expenses.categories.transport') },
    { value: "health", label: t('expenses.categories.health') },
    { value: "other", label: t('expenses.categories.other') },
  ];

  const store = useExpensesStore();
  const expenses = store.expenses;
  const advanceAmount = store.advanceAmount;
  const advanceCurrency = store.advanceCurrency;
  const addExpense = store.addExpense;
  const removeExpense = store.removeExpense;
  const setAdvance = store.setAdvance;

  const spent = expenses
      .filter((e) => e.currency === advanceCurrency)
      .reduce((sum, e) => sum + e.amount, 0);
  const remaining = store.advanceAmount - spent;

  const handleAddExpense = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    addExpense({
      amount: parseFloat(amount),
      currency,
      category,
      note,
      date: new Date().toISOString(),
    });
    setAmount("");
    setNote("");
  };

  if (advanceAmount === 0) {
    return (
        <section className={s.page}>
          <div className={s.wrapper}>
            <div className={s.header}>
              <p className={s.headerLabel}>{t('expenses.newVoyageLabel')}</p>
              <h1 className={s.headerTitle}>{t('expenses.advanceTitle')}</h1>
            </div>

            <div className={s.advanceCard}>
              <div className={s.advanceIcon}>💵</div>
              <p className={s.advanceText}>{t('expenses.advanceText')}</p>

              <div className={s.row}>
                <input
                    type="number"
                    inputMode="decimal"
                    placeholder={t('expenses.amount')}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className={s.inputMono}
                />
                <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as Currency)}
                    className={s.select}
                >
                  {CURRENCIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>

              <button
                  className={s.btnPrimary}
                  onClick={() => {
                    if (!amount || parseFloat(amount) <= 0) return;
                    setAdvance(parseFloat(amount), currency);
                    setAmount("");
                  }}
              >
                {t('expenses.saveAdvance')}
              </button>
            </div>
          </div>
        </section>
    );
  }

  return (
      <section className={s.page}>
        <div className={s.wrapper}>

          <div className={s.header}>
            <p className={s.headerLabel}>{t('expenses.financeLabel')}</p>
            <h1 className={s.headerTitle}>{t('expenses.expensesTitle')}</h1>
          </div>

          <div className={s.statsCard}>
            <div className={s.statRowDark}>
              <div>
                <p className={s.statLabelLight}>{t('expenses.advance')}</p>
                <p className={s.statValueBig}>
                  {advanceAmount} <span className={s.statCurrency}>{advanceCurrency}</span>
                </p>
              </div>
            </div>

            <div className={s.statRowLight}>
              <div>
                <p className={s.statLabel}>{t('expenses.spent')}</p>
                <p className={s.statValue}>
                  {spent} <span className={s.statCurrency}>{advanceCurrency}</span>
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p className={s.statLabel}>{t('expenses.remaining')}</p>
                <p className={s.statValue}>
                  {remaining} <span className={s.statCurrency}>{advanceCurrency}</span>
                </p>
              </div>
            </div>
          </div>

          <div className={s.addCard}>
            <h2 className={s.addCardTitle}>{t('expenses.addExpenseTitle')}</h2>

            <div className={s.row}>
              <input
                  type="number"
                  inputMode="decimal"
                  placeholder={t('expenses.amount')}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={s.inputMono}
              />
              <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as Currency)}
                  className={s.select}
              >
                {CURRENCIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>

            <div className={s.fieldGroup}>
              <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                  className={s.selectFull}
              >
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>

              <input
                  type="text"
                  placeholder={t('expenses.note')}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className={s.input}
              />
            </div>

            <button onClick={handleAddExpense} className={s.btnAddExpense}>
              {t('expenses.addExpense')}
            </button>
          </div>

          <div className={s.listSection}>
            <div className={s.listHeader}>
              <span className={s.listTitle}>{t('expenses.history')}</span>
            </div>

            {expenses.length === 0 ? (
                <div className={s.emptyState}>
                  {t('expenses.empty')}
                </div>
            ) : (
                <div className={s.expenseList}>
                  {expenses.map((exp) => (
                      <div key={exp.id} className={s.expenseCard}>
                        <div className={s.expenseInfo}>
                    <span className={s.expenseCategory}>
                      {CATEGORIES.find(c => c.value === exp.category)?.label || exp.category}
                    </span>
                          {exp.note && <span className={s.expenseNote}>{exp.note}</span>}
                          <span className={s.expenseDate}>
                      {new Date(exp.date).toLocaleDateString("ru-RU", {
                        day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
                      })}
                    </span>
                        </div>

                        <div className={s.expenseRight}>
                    <span className={s.expenseAmount}>
                      -{exp.amount} <span style={{ fontSize: "12px" }}>{exp.currency.toUpperCase()}</span>
                    </span>
                          <button
                              onClick={() => removeExpense(exp.id)}
                              className={s.btnDelete}
                              title={t('contract.delete')}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                  ))}
                </div>
            )}
          </div>
        </div>
      </section>
  );
}