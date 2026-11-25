import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { userApi } from '../api/user'
import Spinner from '../components/ui/Spinner'
import StatCard from '../components/ui/StatCard'
import { User, Mail, Calendar, Save, BarChart2, Target, Edit3 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [profile, setProfile]   = useState(null)
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [editing, setEditing]   = useState(false)
  const [name, setName]         = useState('')

  useEffect(() => {
    userApi.getProfile()
      .then(({ data }) => { setProfile(data); setName(data.full_name) })
      .catch(() => toast.error('Could not load profile.'))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    if (!name.trim() || name.trim().length < 2) { toast.error('Name must be at least 2 characters.'); return }
    setSaving(true)
    try {
      const { data } = await userApi.updateProfile({ full_name: name.trim() })
      setProfile({ ...profile, full_name: data.full_name })
      updateUser(data)
      setEditing(false)
      toast.success('Profile updated!')
    } catch { toast.error('Update failed.') }
    finally { setSaving(false) }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>

  if (!profile) return <div role="alert">Could not load profile. Please refresh and try again.</div>

  const initials = profile?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const joinDate = new Date(profile?.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Profile card */}
      <div className="card p-6">
        <div className="flex items-start gap-5">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-bold text-white">{initials}</span>
          </div>

          <div className="flex-1 min-w-0">
            {editing ? (
              <div className="space-y-3">
                <div>
                  <label className="label">Full name</label>
                  <input
                    className="input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={handleSave} disabled={saving} className="btn-primary">
                    {saving ? <Spinner size="sm" /> : <Save className="w-4 h-4" />}
                    Save changes
                  </button>
                  <button onClick={() => { setEditing(false); setName(profile.full_name) }} className="btn-secondary">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{profile?.full_name}</h2>
                  <button
                    onClick={() => setEditing(true)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
                <div className="mt-3 space-y-1.5">
                  <p className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Mail className="w-4 h-4" /> {profile?.email}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Calendar className="w-4 h-4" /> Member since {joinDate}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Your Statistics</h3>
        <div className="grid grid-cols-2 gap-4">
          <StatCard icon={BarChart2} label="Total Analyses" value={profile?.stats?.total_analyses ?? 0} color="brand" />
          <StatCard icon={Target}   label="Avg Match Score" value={`${profile?.stats?.average_score ?? 0}%`} color="emerald" />
        </div>
      </div>

      {/* Account info */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Account Information</h3>
        <div className="space-y-3">
          {[
            { label: 'User ID', value: `#${profile?.id}` },
            { label: 'Account Status', value: 'Active', className: 'text-emerald-600 dark:text-emerald-400 font-medium' },
          ].map(({ label, value, className }) => (
            <div key={label} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700/50 last:border-0">
              <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
              <span className={`text-sm text-slate-900 dark:text-slate-100 ${className || ''}`}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
