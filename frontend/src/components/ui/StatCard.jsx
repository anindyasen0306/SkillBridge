import clsx from 'clsx'

export default function StatCard({ icon: Icon, label, value, sub, color = 'brand' }) {
  const colors = {
    brand:   'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
    amber:   'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    blue:    'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    red:     'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
  }

  return (
    <div className="card p-5 flex items-start gap-4 animate-slide-up">
      <div className={clsx('w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', colors[color])}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">{value}</p>
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mt-0.5">{label}</p>
        {sub && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}
