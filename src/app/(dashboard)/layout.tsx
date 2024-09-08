import { ApplicationLayout } from '../application-layout'
import { getEvents } from '@/data'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  let events = await getEvents()

  return (
      <ApplicationLayout events={events}>{children}</ApplicationLayout>
  )
}