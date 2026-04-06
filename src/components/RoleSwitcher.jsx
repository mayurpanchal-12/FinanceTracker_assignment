import { useAuth } from '../context/AuthContext';

export default function RoleSwitcher() {
  const { role, switchRole } = useAuth();

  return (
    <div className="flex items-center gap-1.5 px-1.5 py-1.5 rounded-2xl bg-white/60 border border-white/80 shadow-sm backdrop-blur-md select-none">
      {/* Label */}
      <span className="text-[10px] font-bold tracking-widest uppercase text-text-light/50 pl-1 pr-0.5 hidden sm:block">
        Role
      </span>

      {/* Admin button */}
      <button
        onClick={() => switchRole('admin')}
        title="Switch to Admin — can add, edit, delete transactions"
        className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 ${
          role === 'admin'
            ? 'bg-primary text-white shadow-md shadow-primary/25'
            : 'text-text-light hover:bg-primary/8 hover:text-primary'
        }`}
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
        </svg>
        Admin
      </button>

      {/* Viewer button */}
      <button
        onClick={() => switchRole('viewer')}
        title="Switch to Viewer — read-only access"
        className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 ${
          role === 'viewer'
            ? 'bg-blue-500 text-white shadow-md shadow-blue-500/25'
            : 'text-text-light hover:bg-blue-50 hover:text-blue-500'
        }`}
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
        </svg>
        Viewer
      </button>
    </div>
  );
}
