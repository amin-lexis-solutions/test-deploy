import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'
import { Pie } from 'react-chartjs-2'

// Register required elements for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend)

const PieChart = ({ dataset }: { dataset: any }) => {
  // Chart Data
  const data = {
    labels: ['Expired Items', 'Active Items'],
    datasets: [
      {
        label: '# of Items',
        data: [dataset?.expiredCount, dataset?.activeCount], // Example data: 100 expired, 300 active
        backgroundColor: ['#212121', '#76ff03'],
        hoverBackgroundColor: ['#212121', '#76ff03'],
      },
    ],
  }

  return <Pie data={data} />
}

export default PieChart
