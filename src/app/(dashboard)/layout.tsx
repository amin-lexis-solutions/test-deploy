import { getEvents } from '@/data'
import { ApplicationLayout } from '../application-layout'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  let events = await getEvents()

  return <ApplicationLayout events={events}>{children}</ApplicationLayout>
}
