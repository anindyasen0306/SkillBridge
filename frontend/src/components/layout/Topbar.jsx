import { Menu, Sun, Moon, Bell } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { useLocation } from 'react-router-dom'

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/analyze':   'Analyze Resume',
  '/history':   'Analysis History',
  '/profile':   'Profile',
}

export default function Topbar({ onMenuClick }) {
  const { dark, toggleTheme } = useTheme()
  const { user } = useAuth()
  const { pathname } = useLocation()

  const title = Object.entries(pageTitles).find(([key]) => pathname.startsWith(key))?.[1] || 'SkillBridge'

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </button>
        <h1 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Dark mode toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle dark mode"
        >
          {dark
            ? <Sun  className="w-5 h-5 text-amber-500" />
            : <Moon className="w-5 h-5 text-slate-500" />
          }
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center ml-1">
          <span className="text-xs font-bold text-brand-700 dark:text-brand-300">
            {user?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </span>
        </div>
      </div>
    </header>
  )
}
