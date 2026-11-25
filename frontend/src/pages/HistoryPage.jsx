import { useEffect, useState } from 'react'
import { resumeApi } from '../api/resume'
import AnalysisCard from '../components/dashboard/AnalysisCard'
import Pagination from '../components/ui/Pagination'
import EmptyState from '../components/ui/EmptyState'
import Spinner from '../components/ui/Spinner'
import { useNavigate } from 'react-router-dom'
import { History, Upload } from 'lucide-react'

const PAGE_SIZE = 8

export default function HistoryPage() {
  const navigate = useNavigate()
  const [data, setData]       = useState({ results: [], total: 0 })
  const [page, setPage]       = useState(1)
  const [loading, setLoading] = useState(true)

  const fetchHistory = (p) => {
    setLoading(true)
    resumeApi.getHistory(p, PAGE_SIZE)
      .then(({ data }) => setData(data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchHistory(page) }, [page])

  const handleDeleted = (id) => {
    const newResults = data.results.filter((a) => a.id !== id)
    const newTotal = data.total - 1
    setData({ ...data, results: newResults, total: newTotal })
    if (newResults.length === 0 && page > 1) {
      setPage(page - 1)
    }
  }

  const handlePageChange = (p) => {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Analysis History</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {data.total > 0 ? `${data.total} total ${data.total === 1 ? 'analysis' : 'analyses'}` : 'No analyses yet'}
          </p>
        </div>
        <button onClick={() => navigate('/analyze')} className="btn-primary">
          <Upload className="w-4 h-4" /> New Analysis
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Spinner size="lg" />
        </div>
      ) : data.results.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={History}
            title="No analyses yet"
            description="Upload a resume and job description to see your match score and skill gaps."
            action={
              <button onClick={() => navigate('/analyze')} className="btn-primary">
                <Upload className="w-4 h-4" /> Analyze Resume
              </button>
            }
          />
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {data.results.map((a) => (
              <AnalysisCard key={a.id} analysis={a} onDeleted={handleDeleted} />
            ))}
          </div>
          <Pagination
            page={page}
            total={data.total}
            pageSize={PAGE_SIZE}
            onChange={handlePageChange}
          />
        </>
      )}
    </div>
  )
}
