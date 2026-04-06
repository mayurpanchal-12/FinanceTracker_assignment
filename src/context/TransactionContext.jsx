import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  loadTransactions,
  saveTransaction,
  updateTransaction as updateTxInStorage,
  deleteTransaction as deleteTxInStorage,
  loadFilters,
  saveFilters,
} from '../utils/storage';
import { applyFilters } from '../utils/filterUtils';
import { useBudget } from './BudgetContext';
import toast from 'react-hot-toast';

const TransactionContext = createContext(null);

const CATEGORIES = ['Salary', 'Food', 'Transport', 'Shopping', 'Bills', 'Other'];

const todayISO = () => new Date().toISOString().slice(0, 10);

function transactionsReducer(state, action) {
  switch (action.type) {
    case 'SET_TRANSACTIONS':
      return action.payload;
    case 'ADD':
      return [action.payload, ...state];
    case 'UPDATE': {
      const { id, data } = action.payload;
      const index = state.findIndex((t) => t.id === id);
      if (index === -1) return state;
      const next = [...state];
      next[index] = { ...next[index], ...data };
      return next;
    }
    case 'DELETE':
      return state.filter((t) => t.id !== action.payload);
    case 'UNHIGHLIGHT':
      return state.map((t) =>
        t.id === action.payload ? { ...t, highlighted: false } : t
      );
    default:
      return state;
  }
}

function filtersReducer(state, action) {
  switch (action.type) {
    case 'SET_MONTH':  return { ...state, month: action.payload };
    case 'SET_TYPE':   return { ...state, type: action.payload };
    case 'SET_CATEGORY': return { ...state, category: action.payload };
    case 'SET_SEARCH': return { ...state, search: action.payload };
    default: return state;
  }
}

const DEFAULT_FILTERS = { month: '', type: '', category: '', search: '' };

export function TransactionProvider({ children }) {
  const { budgets } = useBudget();

  const [transactions, dispatchTx] = useReducer(
    transactionsReducer,
    undefined,
    () => {
      const today = todayISO();
      const raw = loadTransactions();
      const promoted = [];

      const processed = raw.map((tx) => {
        if (tx.isScheduled && tx.scheduledDate && tx.scheduledDate <= today) {
          // Mark for persisting the promotion
          promoted.push(tx.id);
          return { ...tx, isScheduled: false, scheduledDate: undefined };
        }
        return tx;
      });

      // Persist any promotions back to localStorage immediately
      promoted.forEach((id) => {
        updateTxInStorage(id, { isScheduled: false, scheduledDate: undefined });
      });

      return processed;
    }
  );

  const [filters, dispatchFilter] = useReducer(
    filtersReducer,
    undefined,
    () => loadFilters()
  );

  const [editingId, setEditingId] = useState(null);
  const loading = false;

  // Persist filters whenever they change
  useEffect(() => {
    saveFilters(filters);
  }, [filters]);

  const mainTransactions = useMemo(
    () => transactions.filter((tx) => !tx.isScheduled),
    [transactions]
  );

  const scheduledTransactions = useMemo(
    () => transactions.filter((tx) => tx.isScheduled === true),
    [transactions]
  );

  const filteredTransactions = useMemo(() => {
    const list = applyFilters(mainTransactions, filters);
    let runningBalance = 0;
    return list.map((tx) => {
      runningBalance +=
        tx.type === 'income' ? Number(tx.amount) : -Number(tx.amount);
      return { ...tx, balance: runningBalance };
    });
  }, [mainTransactions, filters]);

  const summaryFromFiltered = useMemo(() => {
    const income = filteredTransactions
      .filter((t) => t.type === 'income')
      .reduce((s, t) => s + Number(t.amount), 0);
    const expense = filteredTransactions
      .filter((t) => t.type === 'expense')
      .reduce((s, t) => s + Number(t.amount), 0);
    const balance = filteredTransactions.reduce(
      (s, t) => s + (t.type === 'income' ? Number(t.amount) : -Number(t.amount)),
      0
    );
    return { income, expense, balance };
  }, [filteredTransactions]);

  const addTransaction = (tx, opts = {}) => {
    const today = todayISO();
    const asScheduled =
      opts.scheduledWhenFuture === true && tx.date && tx.date > today;
    const payload = asScheduled
      ? { ...tx, isScheduled: true, scheduledDate: tx.date }
      : { ...tx };

    try {
      const cleanPayload = Object.fromEntries(
        Object.entries(payload).filter(([, v]) => v !== undefined)
      );
      const newId = saveTransaction(cleanPayload);
      dispatchTx({
        type: 'ADD',
        payload: { ...payload, id: newId, balance: 0 },
      });
      toast.success(asScheduled ? 'Transaction scheduled!' : 'Transaction added!');

      // Budget warning (only for real, non-scheduled expenses)
      if (
        !asScheduled &&
        tx.type === 'expense' &&
        tx.category &&
        budgets[tx.category]
      ) {
        const thisMonth = todayISO().slice(0, 7);
        const categorySpent = [...transactions, { ...payload, id: newId }]
          .filter(
            (t) =>
              !t.isScheduled &&
              t.type === 'expense' &&
              t.category === tx.category &&
              t.date?.startsWith(thisMonth)
          )
          .reduce((s, t) => s + Number(t.amount), 0);
        const limit = Number(budgets[tx.category]);
        const pct = Math.round((categorySpent / limit) * 100);
        if (pct >= 100) {
          toast.error(
            `⚠️ ${tx.category} budget exceeded! ₹${categorySpent.toLocaleString('en-IN')} of ₹${limit.toLocaleString('en-IN')}`,
            { duration: 5000 }
          );
        } else if (pct >= 80) {
          toast(
            `🟡 ${tx.category} budget at ${pct}% — ₹${(limit - categorySpent).toLocaleString('en-IN')} left`,
            { duration: 4000 }
          );
        }
      }
    } catch {
      toast.error('Failed to add transaction.');
    }
  };

  const updateTransaction = (id, data) => {
    try {
      updateTxInStorage(id, data);
      dispatchTx({ type: 'UPDATE', payload: { id, data } });
    } catch {
      toast.error('Failed to update transaction.');
    }
  };

  const deleteTransaction = (id) => {
    try {
      deleteTxInStorage(id);
      dispatchTx({ type: 'DELETE', payload: id });
    } catch {
      toast.error('Failed to delete transaction.');
    }
  };

  const unhighlightTransaction = (id) => {
    updateTxInStorage(id, { highlighted: false });
    dispatchTx({ type: 'UNHIGHLIGHT', payload: id });
  };

  const setFilterMonth    = (v) => dispatchFilter({ type: 'SET_MONTH',    payload: v || '' });
  const setFilterType     = (v) => dispatchFilter({ type: 'SET_TYPE',     payload: v || '' });
  const setFilterCategory = (v) => dispatchFilter({ type: 'SET_CATEGORY', payload: v || '' });
  const setFilterSearch   = (v) => dispatchFilter({ type: 'SET_SEARCH',   payload: v || '' });

  const transactionToEdit = useMemo(
    () => (editingId ? transactions.find((t) => t.id === editingId) : null),
    [transactions, editingId]
  );

  const value = useMemo(
    () => ({
      transactions,
      mainTransactions,
      scheduledTransactions,
      filteredTransactions,
      filters,
      summary: summaryFromFiltered,
      editingId,
      setEditingId,
      transactionToEdit,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      unhighlightTransaction,
      setFilterMonth,
      setFilterType,
      setFilterCategory,
      setFilterSearch,
      categories: CATEGORIES,
      loading,
    }),
    [
      transactions,
      mainTransactions,
      scheduledTransactions,
      filteredTransactions,
      filters,
      summaryFromFiltered,
      editingId,
      transactionToEdit,
      loading,
    ]
  );

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const ctx = useContext(TransactionContext);
  if (!ctx)
    throw new Error('useTransactions must be used within TransactionProvider');
  return ctx;
}
