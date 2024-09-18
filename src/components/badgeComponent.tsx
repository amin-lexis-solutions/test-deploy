export function BadgeComponent({ status }: { status?: string }) {
  const statusClass: any = {
    SUCCEEDED:
      'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium text-green-500 ring-1 ring-inset ring-green-600/20',
    FAILED:
      'inline-flex items-center rounded-md px-4 py-1 text-xs font-medium text-red-500 ring-1 ring-inset ring-red-600/10',
    'TIMED-OUT':
      'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium text-yellow-500 ring-1 ring-inset ring-yellow-600/20',
  }

  const defaultClass =
    'inline-flex items-center rounded-md px-8 py-1 text-xs font-medium text-gray-100 ring-1 ring-inset ring-gray-600'

  const dynamicClass = (className?: string) => statusClass[className || ''] || defaultClass

  return (
    <>
      <span className={dynamicClass(status)}>{status ? status : 'N/A'}</span>
    </>
  )
}
