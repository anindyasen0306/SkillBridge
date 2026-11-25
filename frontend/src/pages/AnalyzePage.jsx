import { useState } from 'react'
import { resumeApi } from '../api/resume'
import ResumeDropzone from '../components/dashboard/ResumeDropzone'
import ScoreCircle from '../components/ui/ScoreCircle'
import SkillTag from '../components/ui/SkillTag'
import Spinner from '../components/ui/Spinner'
import { Lightbulb, XCircle, CheckCircle, List, Zap, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function AnalyzePage() {
  const navigate = useNavigate()
  const [file, setFile]           = useState(null)
  const [jobDesc, setJobDesc]     = useState('')
  const [loading, setLoading]     = useState(false)
  const [result, setResult]       = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file)              { toast.error('Please upload your resume PDF.'); return }
    if (jobDesc.trim().length < 50) { toast.error('Job description must be at least 50 characters.'); return }

    setLoading(true)
    setResult(null)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('job_description', jobDesc.trim())

    try {
      const { data } = await resumeApi.analyze(fd)
      setResult(data)
      toast.success('Analysis complete!')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      const detail = err.response?.data?.detail
      const msg = (typeof detail === "string" ? detail : null) || 'Analysis failed. Please retry later.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  if (result) return <ResultView result={result} onNew={() => { setResult(null); setFile(null); setJobDesc('') }} navigate={navigate} />

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Analyze Your Resume</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Upload your PDF resume and paste a job description to get your AI match score.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <p className="text-xs text-slate-500">Resume text and job description may be sent to a cloud AI provider. Remove personal contact details before uploading.</p>
        <div className="card p-6 space-y-2">
          <label className="label">Resume PDF</label>
          <ResumeDropzone
            file={file}
            onFileSelect={setFile}
            onClear={() => setFile(null)}
          />
        </div>

        <div className="card p-6 space-y-2">
          <label className="label">
            Job Description
            <span className="text-slate-400 dark:text-slate-500 font-normal ml-1">(min 50 chars)</span>
          </label>
          <textarea
            className="input min-h-[200px] resize-y font-mono text-xs leading-relaxed"
            placeholder="Paste the full job description here — include required skills, responsibilities, and qualifications…"
            maxLength={20000}
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
          />
          <p className="text-xs text-slate-400 dark:text-slate-500 text-right">{jobDesc.length} chars</p>
        </div>

        <button
          type="submit"
          disabled={loading || !file || jobDesc.trim().length < 50}
          className="btn-primary w-full justify-center py-3 text-base"
        >
          {loading
            ? <><Spinner size="sm" /> Analyzing with AI…</>
            : <><Zap className="w-4 h-4" /> Analyze Resume</>
          }
        </button>

        {loading && (
          <p className="text-xs text-center text-slate-400 dark:text-slate-500 animate-pulse">
            The LLM is reading your resume and job description. Please wait…
          </p>
        )}
      </form>
    </div>
  )
}

function Section({ icon: Icon, title, color, children }) {
  const colors = {
    green:  'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20',
    red:    'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20',
    blue:   'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20',
    brand:  'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20',
    amber:  'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20',
  }
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function ResultView({ result, onNew, navigate }) {
  return (
    <div className="space-y-6 animate-slide-up">
      {/* Score header */}
      <div className="card p-6 flex flex-col sm:flex-row items-center gap-6">
        <ScoreCircle score={result.match_score} size={140} />
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Analysis Complete</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">{result.filename}</p>
          <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
            <button onClick={onNew} className="btn-secondary">Analyze Another</button>
            <button onClick={() => navigate('/history')} className="btn-primary">
              View History <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Candidate skills */}
        <Section icon={CheckCircle} title={`Your Skills (${result.candidate_skills.length})`} color="green">
          <div className="flex flex-wrap gap-2">
            {result.candidate_skills.length
              ? result.candidate_skills.map((s) => <SkillTag key={s} label={s} variant="green" />)
              : <p className="text-sm text-slate-400">No skills detected.</p>}
          </div>
        </Section>

        {/* Missing skills */}
        <Section icon={XCircle} title={`Missing Skills (${result.missing_skills.length})`} color="red">
          <div className="flex flex-wrap gap-2">
            {result.missing_skills.length
              ? result.missing_skills.map((s) => <SkillTag key={s} label={s} variant="red" />)
              : <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">No missing skills! Great match.</p>}
          </div>
        </Section>
      </div>

      {/* Required skills */}
      <Section icon={List} title={`Required by Job (${result.required_skills.length})`} color="blue">
        <div className="flex flex-wrap gap-2">
          {result.required_skills.map((s) => (
            <SkillTag
              key={s}
              label={s}
              variant={result.missing_skills.includes(s) ? 'red' : 'green'}
            />
          ))}
        </div>
      </Section>

      {/* Learning suggestions */}
      {result.learning_suggestions.length > 0 && (
        <Section icon={Lightbulb} title="Learning Suggestions" color="amber">
          <ul className="space-y-3">
            {result.learning_suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  )
}
