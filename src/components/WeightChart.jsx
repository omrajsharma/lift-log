import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { useApp } from '../context/AppContext'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
)

export default function WeightChart({ logs }) {
  const { unit, isDark } = useApp()

  if (logs.length < 2) {
    return (
      <p className="py-4 text-center text-sm text-neutral-500">
        Log at least 2 sets to see the chart
      </p>
    )
  }

  const sorted = [...logs].sort((a, b) => a.timestamp - b.timestamp)

  const data = {
    labels: sorted.map((l) =>
      new Date(l.timestamp).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      }),
    ),
    datasets: [
      {
        label: `Weight (${unit})`,
        data: sorted.map((l) => l.weight),
        borderColor: isDark ? '#a3a3a3' : '#404040',
        backgroundColor: isDark ? 'rgba(163,163,163,0.1)' : 'rgba(64,64,64,0.1)',
        fill: true,
        tension: 0.2,
        pointRadius: 4,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        ticks: { color: isDark ? '#a3a3a3' : '#737373', maxRotation: 45 },
        grid: { color: isDark ? '#262626' : '#e5e5e5' },
      },
      y: {
        ticks: { color: isDark ? '#a3a3a3' : '#737373' },
        grid: { color: isDark ? '#262626' : '#e5e5e5' },
      },
    },
  }

  return (
    <div className="h-48">
      <Line data={data} options={options} />
    </div>
  )
}
