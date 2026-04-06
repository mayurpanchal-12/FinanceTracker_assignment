import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTransactions } from '../context/TransactionContext';
import toast from 'react-hot-toast';

const todayISO = () => new Date().toISOString().slice(0, 10);

const FieldWrap = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-text-light/70 uppercase tracking-wider">{label}</label>
    {children}
  </div>
);

export default function EditTransactionModal() {
  const { editingId, setEditingId, transactionToEdit, updateTransaction, categories } = useTransactions();

  const [amount, setAmount]     = useState('');
  const [info, setInfo]         = useState('');
  const [date, setDate]         = useState('');
  const [type, setType]         = useState('income');
  const [category, setCategory] = useState('Salary');
  const [note, setNote]         = useState('');
  const [noteVisible, setNoteVisible] = useState(false);
  const [highlighted, setHighlighted] = useState(false);
  const [closing, setClosing]   = useState(false);

  const firstInputRef = useRef(null);

  // Populate fields when a transaction is selected for editing
  useEffect(() => {
    if (!transactionToEdit) return;
    setAmount(String(transactionToEdit.amount));
    setInfo(transactionToEdit.info || '');
    setDate(transactionToEdit.scheduledDate || transactionToEdit.date || '');
    setType(transactionToEdit.type || 'income');
    setCategory(transactionToEdit.category || 'Salary');
    const n = transactionToEdit.note ? String(transactionToEdit.note) : '';
    setNote(n);
    setNoteVisible(!!n);
    setHighlighted(!!transactionToEdit.highlighted);
    setClosing(false);
    setTimeout(() => firstInputRef.current?.focus(), 80);
  }, [transactionToEdit]);

  const close = () => {
    setClosing(true);
    setTimeout(() => {
      setEditingId(null);
      setClosing(false);
    }, 220);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const amt = Number(amount);
    if (!date || !info.trim() || isNaN(amt) || amt <= 0) {
      toast.error('Please fill all fields with a valid amount.');
      return;
    }

    const today = todayISO();
    const isScheduled = transactionToEdit?.isScheduled && date > today;

    updateTransaction(editingId, {
      amount: amt,
      info: info.trim(),
      date,
      type,
      category,
      highlighted,
      note: note.trim() || undefined,
      ...(isScheduled
        ? { isScheduled: true, scheduledDate: date }
        : { isScheduled: false, scheduledDate: undefined }),
    });

    toast.success('Transaction updated!');
    close();
  };

  if (!editingId || !transactionToEdit) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center px-4 transition-all duration-200 ${closing ? 'opacity-0' : 'opacity-100'}`}
      style={{ backdropFilter: 'blur(6px)', background: 'rgba(15,23,42,0.45)' }}
      onClick={close}
    >
      <div
        className={`relative w-full max-w-md bg-white dark:bg-[#1a2035] rounded-3xl shadow-2xl border border-white/60 dark:border-white/8 overflow-hidden transition-all duration-220 ${closing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}
        style={{ transform: closing ? 'scale(0.96) translateY(12px)' : 'scale(1) translateY(0)', transition: 'transform 0.22s cubic-bezier(.4,0,.2,1), opacity 0.22s' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent bar */}
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-primary via-accent to-primary/60" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 dark:border-white/8">
          <div>
            <h2 className="text-lg font-extrabold text-text-main tracking-tight">Edit Transaction</h2>
            <p className="text-xs text-text-light mt-0.5">Update the details below</p>
          </div>
          <button
            onClick={close}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-white/8 dark:hover:bg-white/14 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">

          {/* Amount + Type row */}
          <div className="grid grid-cols-2 gap-3">
            <FieldWrap label="Amount (₹)">
              <input
                ref={firstInputRef}
                type="number" min="0" step="0.01" placeholder="0.00"
                value={amount} onChange={(e) => setAmount(e.target.value)}
                className="field"
              />
            </FieldWrap>
            <FieldWrap label="Type">
              <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-white/10">
                {['income', 'expense'].map((t) => (
                  <button
                    key={t} type="button"
                    onClick={() => setType(t)}
                    className={`flex-1 py-2 text-xs font-bold capitalize transition-all duration-150 ${
                      type === t
                        ? t === 'income'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-red-500 text-white'
                        : 'bg-gray-50 dark:bg-white/5 text-text-light hover:bg-gray-100 dark:hover:bg-white/10'
                    }`}
                  >
                    {t === 'income' ? '↑ Income' : '↓ Expense'}
                  </button>
                ))}
              </div>
            </FieldWrap>
          </div>

          {/* Description */}
          <FieldWrap label="Description">
            <input
              type="text" placeholder="Transaction details"
              value={info} onChange={(e) => setInfo(e.target.value)}
              className="field"
            />
          </FieldWrap>

          {/* Date + Category row */}
          <div className="grid grid-cols-2 gap-3">
            <FieldWrap label="Date">
              <input
                type="date" value={date}
                onChange={(e) => setDate(e.target.value)}
                className="field"
              />
            </FieldWrap>
            <FieldWrap label="Category">
              <select
                value={category} onChange={(e) => setCategory(e.target.value)}
                className="field appearance-none cursor-pointer"
              >
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </FieldWrap>
          </div>

          {/* Highlight toggle */}
          <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/8">
            <span className="text-xs font-semibold text-text-light">⭐ Highlight this transaction</span>
            <button
              type="button"
              onClick={() => setHighlighted((h) => !h)}
              className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${highlighted ? 'bg-amber-400' : 'bg-gray-200 dark:bg-white/15'}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${highlighted ? 'left-[22px]' : 'left-0.5'}`} />
            </button>
          </div>

          {/* Note toggle */}
          <div>
            <button
              type="button"
              onClick={() => setNoteVisible((v) => !v)}
              className="text-xs font-semibold text-primary/70 hover:text-primary transition-colors"
            >
              {noteVisible ? '− Hide note' : '+ Add note'}
            </button>
            {noteVisible && (
              <input
                type="text" placeholder="Short note or reminder…"
                value={note} onChange={(e) => setNote(e.target.value)}
                className="field mt-2"
              />
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button" onClick={close}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-text-light text-sm font-semibold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white text-sm font-bold shadow-md shadow-primary/20 hover:shadow-lg hover:scale-[1.01] transition-all duration-200"
            >
              ✓ Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>,
    document.body
  );
}
