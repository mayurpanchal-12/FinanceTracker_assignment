import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import DeleteAccount from './DeleteAccount';

export default function UserPill() {
  const { role } = useAuth();
  const [open, setOpen] = useState(false);
  const pillRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (pillRef.current && !pillRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={pillRef}
      onClick={() => setOpen((p) => !p)}
      className="flex items-center rounded-full bg-white/70 border border-white/80 shadow-md backdrop-blur-md cursor-pointer select-none"
      style={{
        maxWidth: open ? '320px' : '36px',
        width: open ? '320px' : '36px',
        padding: open ? '4px 10px 4px 4px' : '0',
        transition: 'max-width 0.3s ease, width 0.3s ease, padding 0.3s ease',
        overflow: 'hidden',
      }}
    >
      {/* Avatar */}
      <div className={`w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-sm ${
        role === 'admin'
          ? 'bg-gradient-to-br from-primary to-accent'
          : 'bg-gradient-to-br from-blue-400 to-blue-600'
      }`}>
        {role === 'admin' ? 'A' : 'V'}
      </div>

      <div
        className="flex items-center gap-2"
        style={{
          opacity: open ? 1 : 0,
          transition: 'opacity 0.2s ease',
          marginLeft: open ? '8px' : '0',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        }}
      >
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${
          role === 'admin'
            ? 'bg-primary/10 text-primary'
            : 'bg-blue-50 text-blue-500'
        }`}>
          {role}
        </span>

        <span className="text-xs font-semibold text-text-main max-w-[110px] truncate">
          This Device
        </span>

        <div className="w-px h-4 bg-gray-200 shrink-0" />

        <div onClick={(e) => e.stopPropagation()}>
          <DeleteAccount />
        </div>
      </div>
    </div>
  );
}
