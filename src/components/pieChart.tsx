import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'
import { Pie } from 'react-chartjs-2'

// Register required elements for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend)

const PieChart = ({ dataset }: { dataset: any }) => {
  // Chart Data
  const data = {
    labels: ['Expired Items', 'Active Items', 'Undefined Items'],
    datasets: [
      {
        label: '# of Items',
        data: [dataset?.expiredCount, dataset?.activeCount, dataset?.nullableCount], // Example data: 100 expired, 300 active
        backgroundColor: ['#f44336', '#76ff03', '#212121'],
        hoverBackgroundColor: ['#f44336', '#76ff03', '#212121'],
      },
    ],
  }

  return <Pie data={data} />
}

export default PieChart
