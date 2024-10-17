'use client'

import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

// Configuration options for the chart
const getOptions = (isMobile: boolean) => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  stacked: false,
  plugins: {
    title: {
      display: true,
      text: 'Daily scraping stats',
      font: {
        size: isMobile ? 14 : 16,
      },
    },
    legend: {
      labels: {
        font: {
          size: isMobile ? 10 : 12,
        },
      },
    },
  },
  scales: {
    x: {
      ticks: {
        font: {
          size: isMobile ? 8 : 10,
        },
      },
    },
    y1: {
      type: 'linear' as const,
      display: true,
      position: 'left' as const,
      ticks: {
        font: {
          size: isMobile ? 8 : 10,
        },
      },
    },
    y2: {
      type: 'linear' as const,
      display: true,
      position: 'right' as const,
      grid: {
        drawOnChartArea: false,
      },
      ticks: {
        font: {
          size: isMobile ? 8 : 10,
        },
      },
    },
  },
})

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const day = date.getUTCDate()
  const month = date.toLocaleString('en-US', { month: 'short' })
  return `${day} ${month}`
}

const MultiAxisLineChart = ({ data }: { data: any }) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768) // Adjust this breakpoint as needed
    }

    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)

    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  const schema = {
    labels: data?.dates?.map((date: string) => formatDate(date)),

    datasets: [
      {
        label: 'Items count',
        data: data?.items,
        borderColor: 'rgb(41,98,255)',
        backgroundColor: 'rgb(41,98,255)',
        yAxisID: 'y1',
      },
      {
        label: 'Targets count',
        data: data?.targets,
        borderColor: 'rgb(170,0,255)',
        backgroundColor: 'rgb(170,0,255)',
        yAxisID: 'y2',
      },
    ],
  }

  return (
    <div style={{ height: isMobile ? '300px' : '400px' }}>
      <Line data={schema} options={getOptions(isMobile)} />
    </div>
  )
}

export default MultiAxisLineChart
