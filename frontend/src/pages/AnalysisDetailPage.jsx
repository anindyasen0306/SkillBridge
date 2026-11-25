import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { resumeApi } from '../api/resume'
import ScoreCircle from '../components/ui/ScoreCircle'
import SkillTag from '../components/ui/SkillTag'
import Spinner from '../components/ui/Spinner'
import { ArrowLeft, CheckCircle, XCircle, List, Lightbulb, Calendar, FileText, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AnalysisDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    resumeApi.getAnalysis(id)
      .then(({ data }) => setAnalysis(data))
      .catch(() => { toast.error('Analysis not found.'); navigate('/history') })
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    if (!confirm('Delete this analysis permanently?')) return
    try {
      await resumeApi.deleteAnalysis(id)
      toast.success('Analysis deleted.')
      navigate('/history')
    } catch { toast.error('Delete failed.') }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>
  if (!analysis) return null

  const date = new Date(analysis.created_at).toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Back + actions */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/history')} className="btn-secondary">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button onClick={handleDelete} className="btn-danger">
          <Trash2 className="w-4 h-4" /> Delete
        </button>
      </div>

      {/* Header card */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <ScoreCircle score={analysis.match_score} size={150} />
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2 justify-center sm:justify-start">
              <FileText className="w-5 h-5 text-brand-500" />
              {analysis.filename}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4 justify-center sm:justify-start">
              <Calendar className="w-3.5 h-3.5" /> {date}
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 text-left">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Job Description</p>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-4">
                {analysis.job_description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Skills grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Your Skills <span className="text-slate-400 font-normal">({analysis.candidate_skills.length})</span>
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.candidate_skills.map((s) => <SkillTag key={s} label={s} variant="green" />)}
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <XCircle className="w-4 h-4 text-red-500" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Missing Skills <span className="text-slate-400 font-normal">({analysis.missing_skills.length})</span>
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.missing_skills.length
              ? analysis.missing_skills.map((s) => <SkillTag key={s} label={s} variant="red" />)
              : <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">No missing skills!</p>
            }
          </div>
        </div>
      </div>

      {/* Required skills */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <List className="w-4 h-4 text-blue-500" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Required Skills <span className="text-slate-400 font-normal">({analysis.required_skills.length})</span>
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {analysis.required_skills.map((s) => (
            <SkillTag key={s} label={s} variant={analysis.missing_skills.includes(s) ? 'red' : 'green'} />
          ))}
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-3">
          <span className="inline-block w-2 h-2 rounded-sm bg-emerald-400 mr-1" />You have it
          <span className="inline-block w-2 h-2 rounded-sm bg-red-400 ml-3 mr-1" />Missing
        </p>
      </div>

      {/* Learning suggestions */}
      {analysis.learning_suggestions.length > 0 && (
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Learning Suggestions</h3>
          </div>
          <ul className="space-y-4">
            {analysis.learning_suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
