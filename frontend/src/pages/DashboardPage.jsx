import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { userApi } from '../api/user'
import { resumeApi } from '../api/resume'
import StatCard from '../components/ui/StatCard'
import AnalysisCard from '../components/dashboard/AnalysisCard'
import { BarChart2, Target, Zap, TrendingUp, ArrowRight, History } from 'lucide-react'
import Spinner from '../components/ui/Spinner'

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [recent, setRecent]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      userApi.getProfile(),
      resumeApi.getHistory(1, 3),
    ]).then(([pRes, hRes]) => {
      setProfile(pRes.data)
      setRecent(hRes.data.results)
    }).finally(() => setLoading(false))
  }, [])

  const firstName = user?.full_name?.split(' ')[0] || 'there'

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    )
  }

  const stats = profile?.stats || {}

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Greeting */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Good {getGreeting()}, {firstName} 👋
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Here's a summary of your resume analysis activity.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={BarChart2}
          label="Total Analyses"
          value={stats.total_analyses ?? 0}
          color="brand"
        />
        <StatCard
          icon={Target}
          label="Avg Match Score"
          value={`${stats.average_score ?? 0}%`}
          color="emerald"
        />
        <StatCard
          icon={TrendingUp}
          label="Skills Identified"
          value={recent.reduce((s, a) => s + (a.candidate_skills?.length ?? 0), 0)}
          sub="Across recent analyses"
          color="blue"
        />
        <StatCard
          icon={Zap}
          label="Gaps Found"
          value={recent.reduce((s, a) => s + (a.missing_skills?.length ?? 0), 0)}
          sub="Skills to bridge"
          color="amber"
        />
      </div>

      {/* Quick action */}
      {stats.total_analyses === 0 && (
        <div className="card p-8 border-dashed text-center">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center mx-auto mb-4">
            <Zap className="w-7 h-7 text-brand-600 dark:text-brand-400" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">Analyze your first resume</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-5 max-w-xs mx-auto">
            Upload your PDF resume and a job description to get an instant AI-powered match score.
          </p>
          <button onClick={() => navigate('/analyze')} className="btn-primary mx-auto">
            Get Started <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Recent analyses */}
      {recent.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Recent Analyses</h3>
            <Link to="/history" className="text-sm text-brand-600 dark:text-brand-400 font-medium hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {recent.map((a) => (
              <AnalysisCard key={a.id} analysis={a} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}
