import { useRef, useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { useSpeechInput } from '../hooks/useSpeechInput';
import toast from 'react-hot-toast';

// This hook is ONLY for adding new transactions.
// Editing is handled by EditTransactionModal.
export default function useFormState(scheduledPage = false) {
  const { addTransaction, categories } = useTransactions();

  const [amount,          setAmount]    = useState('');
  const [info,            setInfo]      = useState('');
  const [date,            setDate]      = useState('');
  const [type,            setType]      = useState('income');
  const [category,        setCategory]  = useState('Salary');
  const [highlightActive, setHighlight] = useState(false);
  const [note,            setNote]      = useState('');
  const [noteVisible,     setNoteVisible] = useState(false);
  const [isListening,     setIsListening] = useState(false);

  const infoRef = useRef(null);
  const { isSupported, startListening, stopListening } = useSpeechInput();

  const clearForm = () => {
    setAmount(''); setInfo(''); setDate(''); setType('income');
    setCategory('Salary'); setHighlight(false); setNote(''); setNoteVisible(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const amt = Number(amount);
    const trimmedInfo = info.trim();
    if (!date || !trimmedInfo || Number.isNaN(amt) || amt <= 0) {
      toast.error('Please enter a positive amount and fill all fields.');
      return;
    }
    addTransaction(
      { date, amount: amt, info: trimmedInfo, type, category, highlighted: highlightActive, note: note.trim() || undefined },
      { scheduledWhenFuture: scheduledPage }
    );
    setAmount(''); setInfo(''); setNote(''); setNoteVisible(false);
  };

  const handleMicClick = () => {
    if (!isListening) {
      setIsListening(true);
      startListening((t) => setInfo((p) => p.trim() ? `${p.trim()} ${t}` : t), () => setIsListening(false));
    } else {
      stopListening();
      setIsListening(false);
    }
  };

  return {
    amount, setAmount,
    info, setInfo,
    date, setDate,
    type, setType,
    category, setCategory,
    highlightActive, setHighlight,
    note, setNote,
    noteVisible, setNoteVisible,
    isListening,
    infoRef,
    isEditMode: false,
    categories,
    isSupported,
    clearForm,
    handleSubmit,
    handleMicClick,
  };
}
