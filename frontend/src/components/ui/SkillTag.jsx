import clsx from 'clsx'

const variants = {
  green:  'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
  red:    'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800',
  blue:   'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800',
  brand:  'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800',
  slate:  'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600',
}

export default function SkillTag({ label, variant = 'slate' }) {
  return (
    <span className={clsx('inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium', variants[variant])}>
      {label}
    </span>
  )
}
