import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

function getColor(score) {
  if (score >= 75) return '#10b981'  // emerald
  if (score >= 50) return '#f59e0b'  // amber
  return '#ef4444'                    // red
}

function getLabel(score) {
  if (score >= 75) return 'Excellent Match'
  if (score >= 50) return 'Good Match'
  if (score >= 25) return 'Partial Match'
  return 'Low Match'
}

export default function ScoreCircle({ score, size = 160 }) {
  const color = getColor(score)
  const rounded = Math.round(score)

  return (
    <div className="flex flex-col items-center gap-3">
      <div style={{ width: size, height: size }}>
        <CircularProgressbar
          value={rounded}
          text={`${rounded}%`}
          styles={buildStyles({
            textSize: '18px',
            textColor: color,
            pathColor: color,
            trailColor: 'rgba(148,163,184,0.2)',
            pathTransitionDuration: 0.8,
          })}
        />
      </div>
      <span
        className="text-sm font-semibold px-3 py-1 rounded-full"
        style={{ color, backgroundColor: `${color}20` }}
      >
        {getLabel(rounded)}
      </span>
    </div>
  )
}
