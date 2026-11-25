import { ChevronLeft, ChevronRight } from 'lucide-react'
import clsx from 'clsx'

export default function Pagination({ page, total, pageSize, onChange }) {
  const totalPages = Math.ceil(total / pageSize)
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const visible = pages.filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)

  const rendered = []
  let prev = null
  for (const p of visible) {
    if (prev && p - prev > 1) rendered.push('...')
    rendered.push(p)
    prev = p
  }

  return (
    <div className="flex items-center justify-between gap-2 mt-6">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Showing {Math.min((page - 1) * pageSize + 1, total)}–{Math.min(page * pageSize, total)} of {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="btn-secondary !px-2 !py-2 disabled:opacity-40"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {rendered.map((p, i) =>
          p === '...' ? (
            <span key={`dot-${i}`} className="px-2 text-slate-400 text-sm">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={clsx(
                'w-9 h-9 rounded-lg text-sm font-medium transition-all',
                p === page
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              )}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          className="btn-secondary !px-2 !py-2 disabled:opacity-40"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
