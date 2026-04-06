import { NavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import UserPill from './userPill';

const TOOLS_LINKS = [
  { to: '/set-transaction', label: 'Schedule', icon: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
    </svg>
  )},
  { to: '/notes', label: 'Notes', icon: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
    </svg>
  )},

];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-[270px] bg-white/97 dark:bg-[#12172a]/97 backdrop-blur-xl border-r border-gray-200/60 dark:border-white/5 shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100/80 dark:border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-sm shadow-primary/30">
              <span className="text-white text-sm font-bold">₹</span>
            </div>
            <div>
              <h2 className="text-sm font-extrabold tracking-tight text-text-main leading-tight">More Tools</h2>
              <p className="text-[10px] text-text-light font-medium tracking-wider uppercase">Extras</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-white/8 dark:hover:bg-white/14 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <nav className="flex-1 flex flex-col gap-1 px-3 py-4 overflow-y-auto">
          <p className="text-[10px] font-bold tracking-widest uppercase text-text-light/50 px-2 mb-1">Navigation</p>
          {TOOLS_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-text-light hover:bg-primary/8 hover:text-primary dark:hover:bg-primary/15'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 dark:bg-white/8 text-text-light group-hover:text-primary'
                  }`}>
                    {link.icon}
                  </span>
                  {link.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-gray-100/80 dark:border-white/5 flex flex-col gap-2">
          <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/8">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400/20 to-violet-400/20 dark:from-amber-300/20 dark:to-violet-500/20 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-amber-500 dark:text-violet-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
              </div>
              <span className="text-xs font-semibold text-text-light">Appearance</span>
            </div>
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/8">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0">
              <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <UserPill />
          </div>
        </div>
      </aside>
    </>
  );
}
