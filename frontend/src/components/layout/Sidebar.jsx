import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Upload, History, User, LogOut, X, Zap } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import clsx from 'clsx'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/analyze',   icon: Upload,          label: 'Analyze Resume' },
  { to: '/history',   icon: History,         label: 'History' },
  { to: '/profile',   icon: User,            label: 'Profile' },
]

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user?.full_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <aside
      className={clsx(
        'fixed inset-y-0 left-0 z-30 w-64 flex flex-col bg-white dark:bg-slate-900',
        'border-r border-slate-200 dark:border-slate-800',
        'transition-transform duration-300 ease-in-out',
        'lg:static lg:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-5 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            SkillBridge
          </span>
        </div>
        <button onClick={onClose} className="lg:hidden p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
          <X className="w-5 h-5 text-slate-500" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
              )
            }
          >
            <Icon className="w-4.5 h-4.5 w-[18px] h-[18px] flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="px-3 py-4 border-t border-slate-200 dark:border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-brand-700 dark:text-brand-300">{initials}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{user?.full_name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                     text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20
                     hover:text-red-600 dark:hover:text-red-400 transition-all duration-150"
        >
          <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
          Logout
        </button>
      </div>
    </aside>
  )
}
