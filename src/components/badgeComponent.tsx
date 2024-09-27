export function BadgeComponent({ status }: { status?: string }) {
  const green =
    'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium text-green-500 ring-1 ring-inset ring-green-600/20'

  const red =
    'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium text-red-500 ring-1 ring-inset ring-red-600/10'

  const gray =
    'inline-flex items-center rounded-md px-8 py-1 text-xs font-medium text-gray-300 dark:text-gray-100 ring-1 ring-inset ring-gray-300'

  const purple =
    'bg-purple-100 text-purple-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-purple-900 dark:text-purple-300'

  const statusClass: any = {
    SUCCEEDED: green,
    FAILED: red,
    'TIMED-OUT':
      'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium text-yellow-500 ring-1 ring-inset ring-yellow-600/20',
    reliable: green,
    active: green,
    enabled: green,
    disabled: red,
  }

  const dynamicClass = (className?: string) => {
    return className?.includes('proxy') ? purple : statusClass[className || ''] || gray
  }

  return (
    <>
      <span className={dynamicClass(status)}>{status ? status : 'N/A'}</span>
    </>
  )
}
