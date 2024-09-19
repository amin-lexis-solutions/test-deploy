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
import { Line } from 'react-chartjs-2'

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

// Configuration options for the chart
const options = {
  responsive: true,
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  stacked: false,
  plugins: {
    title: {
      display: true,
      text: 'Daily scraping stats',
    },
  },
  scales: {
    y1: {
      type: 'linear' as const,
      display: true,
      position: 'left' as const,
    },
    y2: {
      type: 'linear' as const,
      display: true,
      position: 'right' as const,
      grid: {
        drawOnChartArea: false, // This disables the grid for the secondary y-axis
      },
    },
  },
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)

  const day = date.getUTCDate() // Get the day (1-31)
  const month = date.toLocaleString('en-US', { month: 'short' }) // Get the month in short format (e.g., 'Jun')

  return `${day} ${month}` // Return formatted date as '31 Jun'
}

const MultiAxisLineChart = ({ data }: { data: any }) => {
  const schema = {
    labels: data?.dates?.map((date: string) => formatDate(date)),
    datasets: [
      {
        label: 'Items count',
        data: data.items,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        yAxisID: 'y1',
      },
      {
        label: 'Targets count',
        data: data.targets,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        yAxisID: 'y2',
      },
    ],
  }
  return <Line data={schema} options={options} />
}

export default MultiAxisLineChart
