'use client'

import { useEffect, useRef } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

interface DataChartProps {
  data: string
}

export default function DataChart({ data }: DataChartProps) {
  // Parse data to extract numbers
  const parseData = () => {
    const lines = data.split('\n').filter(line => line.trim())
    const labels: string[] = []
    const values: number[] = []

    lines.forEach(line => {
      // 1. Try "Label: Value" format
      const colonMatch = line.match(/([^:]+):\s*([\d,]+)/)
      if (colonMatch) {
        labels.push(colonMatch[1].trim())
        values.push(parseInt(colonMatch[2].replace(/,/g, '')))
        return
      }

      // 2. Try CSV format "Label,Value"
      const csvParts = line.split(',')
      if (csvParts.length >= 2) {
        const label = csvParts[0].trim().replace(/^"|"$/g, '')
        const valueStr = csvParts[1].trim().replace(/^"|"$/g, '')
        const value = parseFloat(valueStr)

        if (!isNaN(value)) {
          labels.push(label)
          values.push(value)
        }
      }
    })

    return { labels, values }
  }

  const { labels, values } = parseData()

  if (labels.length === 0 || values.length === 0) {
    return (
      <div className="bg-gray-900/50 rounded-xl p-6 text-center">
        <p className="text-gray-400 text-sm">📊 No numeric data found to visualize</p>
      </div>
    )
  }

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Data Values',
        data: values,
        borderColor: 'rgb(6, 182, 212)',
        backgroundColor: 'rgba(6, 182, 212, 0.5)',
        tension: 0.3,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#e5e7eb',
        },
      },
      title: {
        display: true,
        text: 'Data Visualization',
        color: '#06b6d4',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          color: '#9ca3af',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        ticks: {
          color: '#9ca3af',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl">
      <h3 className="text-xl font-bold mb-4 text-purple-400 flex items-center gap-2">
        <span>📈</span>
        <span>Data Visualization</span>
      </h3>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Line Chart */}
        <div className="bg-gray-900/50 rounded-xl p-4" style={{ height: '300px' }}>
          <Line data={chartData} options={options} />
        </div>

        {/* Bar Chart */}
        <div className="bg-gray-900/50 rounded-xl p-4" style={{ height: '300px' }}>
          <Bar data={chartData} options={{ ...options, plugins: { ...options.plugins, title: { ...options.plugins.title, text: 'Bar Chart View' } } }} />
        </div>
      </div>

      {/* Data Table */}
      <div className="mt-4 bg-gray-900/50 rounded-xl p-4 overflow-x-auto">
        <h4 className="font-semibold text-sm mb-3 text-gray-400 uppercase tracking-wide">Data Table</h4>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-2 px-3 text-cyan-400">Label</th>
              <th className="text-right py-2 px-3 text-cyan-400">Value</th>
            </tr>
          </thead>
          <tbody>
            {labels.map((label, i) => (
              <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/50">
                <td className="py-2 px-3 text-gray-300">{label}</td>
                <td className="text-right py-2 px-3 text-gray-300 font-mono">{values[i].toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
