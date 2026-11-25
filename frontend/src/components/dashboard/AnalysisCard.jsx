import { FileText, Calendar, ChevronRight, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { resumeApi } from '../../api/resume'
import toast from 'react-hot-toast'
import clsx from 'clsx'

function ScoreBadge({ score }) {
  const rounded = Math.round(score)
  const cls =
    rounded >= 75 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' :
    rounded >= 50 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' :
                    'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'

  return (
    <span className={clsx('px-2.5 py-0.5 rounded-full text-xs font-bold tabular-nums', cls)}>
      {rounded}%
    </span>
  )
}

export default function AnalysisCard({ analysis, onDeleted }) {
  const navigate = useNavigate()

  const handleDelete = async (e) => {
    e.stopPropagation()
    if (!confirm('Delete this analysis? This cannot be undone.')) return
    try {
      await resumeApi.deleteAnalysis(analysis.id)
      toast.success('Analysis deleted.')
      onDeleted?.(analysis.id)
    } catch {
      toast.error('Failed to delete analysis.')
    }
  }

  const date = new Date(analysis.created_at).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })

  return (
    <div
      onClick={() => navigate(`/history/${analysis.id}`)}
      className="card p-5 cursor-pointer hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600
                 transition-all duration-200 group animate-fade-in"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{analysis.filename}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{analysis.job_description}</p>
            <div className="flex items-center gap-2 mt-2">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span className="text-xs text-slate-400">{date}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <ScoreBadge score={analysis.match_score} />
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-900/20
                       hover:text-red-600 dark:hover:text-red-400 text-slate-400 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-brand-500 transition-colors" />
        </div>
      </div>

      {/* Skill summary */}
      <div className="mt-4 flex gap-4 text-xs text-slate-500 dark:text-slate-400">
        <span><span className="font-semibold text-emerald-600 dark:text-emerald-400">{analysis.candidate_skills?.length ?? 0}</span> skills found</span>
        <span><span className="font-semibold text-red-500 dark:text-red-400">{analysis.missing_skills?.length ?? 0}</span> skills missing</span>
        <span><span className="font-semibold text-brand-600 dark:text-brand-400">{analysis.learning_suggestions?.length ?? 0}</span> suggestions</span>
      </div>
    </div>
  )
}
