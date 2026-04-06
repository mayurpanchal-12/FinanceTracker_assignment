// localStorage-based storage — no Firebase

const TX_KEY = 'finance_tracker_transactions';
const FILTERS_KEY = 'finance_tracker_filters';
const BUDGETS_KEY = 'finance_tracker_budgets';

// ── Transactions ──────────────────────────────────────────────────────────────

export function loadTransactions() {
  try {
    const raw = localStorage.getItem(TX_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return [...data].sort((a, b) =>
      String(b.date || '').localeCompare(String(a.date || ''))
    );
  } catch {
    return [];
  }
}

export function saveTransaction(transaction) {
  try {
    const all = loadTransactions();
    const id = crypto.randomUUID();
    const newTx = { ...transaction, id };
    const updated = [newTx, ...all];
    localStorage.setItem(TX_KEY, JSON.stringify(updated));
    return id;
  } catch (error) {
    console.error('Error saving transaction:', error);
  }
}

export function updateTransaction(id, data) {
  try {
    const all = loadTransactions();
    const index = all.findIndex((t) => t.id === id);
    if (index === -1) return;
    all[index] = { ...all[index], ...data };
    localStorage.setItem(TX_KEY, JSON.stringify(all));
  } catch (error) {
    console.error('Error updating transaction:', error);
  }
}

export function deleteTransaction(id) {
  try {
    const all = loadTransactions();
    const updated = all.filter((t) => t.id !== id);
    localStorage.setItem(TX_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error deleting transaction:', error);
  }
}

// ── Filters ───────────────────────────────────────────────────────────────────

export function saveFilters(filters) {
  try {
    localStorage.setItem(FILTERS_KEY, JSON.stringify(filters));
  } catch (error) {
    console.error('Error saving filters:', error);
  }
}

export function loadFilters() {
  try {
    const raw = localStorage.getItem(FILTERS_KEY);
    if (!raw) return { month: '', type: '', category: '', search: '' };
    const data = JSON.parse(raw);
    return {
      month: data.month || '',
      type: data.type || '',
      category: data.category || '',
      search: data.search || '',
    };
  } catch {
    return { month: '', type: '', category: '', search: '' };
  }
}

// ── Budgets ───────────────────────────────────────────────────────────────────

export function loadBudgets() {
  try {
    const raw = localStorage.getItem(BUDGETS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveBudgets(budgets) {
  try {
    localStorage.setItem(BUDGETS_KEY, JSON.stringify(budgets));
  } catch (error) {
    console.error('Error saving budgets:', error);
  }
}
