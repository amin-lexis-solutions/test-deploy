import { type NextPage } from 'next'
import dynamic from 'next/dynamic'

const HomeContent = dynamic(() => import('./HomeContent'), { ssr: false })

const Home: NextPage = () => {
  return <HomeContent />
}

export default Home
