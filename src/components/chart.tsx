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

// Example data
const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Dataset 1 (Primary Y-Axis)',
      data: [65, 59, 80, 81, 56, 55, 40],
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      yAxisID: 'y1',
    },
    {
      label: 'Dataset 2 (Secondary Y-Axis)',
      data: [28, 48, 40, 19, 86, 27, 90],
      borderColor: 'rgba(255, 99, 132, 1)',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      yAxisID: 'y2',
    },
  ],
}

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
      text: 'Multi-Axis Line Chart Example',
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

const MultiAxisLineChart = () => {
  return <Line data={data} options={options} />
}

export default MultiAxisLineChart
