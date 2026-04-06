import { createContext, useContext, useState, useCallback } from 'react';
import { loadBudgets, saveBudgets } from '../utils/storage';

const BudgetContext = createContext(null);

export function BudgetProvider({ children }) {
  const [budgets, setBudgets] = useState(() => loadBudgets());
  const loading = false; // synchronous — no async needed
  const canEdit = true;

  const persist = useCallback((next) => {
    saveBudgets(next);
  }, []);

  const setBudgetForCategory = useCallback(
    (cat, amount) => {
      const next = { ...budgets, [cat]: Number(amount) };
      setBudgets(next);
      persist(next);
    },
    [budgets, persist]
  );

  const removeBudgetForCategory = useCallback(
    (cat) => {
      const next = { ...budgets };
      delete next[cat];
      setBudgets(next);
      persist(next);
    },
    [budgets, persist]
  );

  return (
    <BudgetContext.Provider
      value={{ budgets, loading, canEdit, setBudgetForCategory, removeBudgetForCategory }}
    >
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudget() {
  const ctx = useContext(BudgetContext);
  if (!ctx) throw new Error('useBudget must be used within BudgetProvider');
  return ctx;
}
