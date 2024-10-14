'use client'

import clsx from 'clsx'
import type React from 'react'
import { createContext, useContext, useState } from 'react'
import { Link } from './link'

const TableContext = createContext<{ bleed: boolean; dense: boolean; grid: boolean; striped: boolean }>({
  bleed: false,
  dense: false,
  grid: false,
  striped: false,
})

export function Table({
  bleed = false,
  dense = false,
  grid = false,
  striped = false,
  className,
  children,
  ...props
}: { bleed?: boolean; dense?: boolean; grid?: boolean; striped?: boolean } & React.ComponentPropsWithoutRef<'div'>) {
  return (
    <TableContext.Provider value={{ bleed, dense, grid, striped } as React.ContextType<typeof TableContext>}>
      <div className="overflow-x-auto">
        <div {...props} className={clsx(className, 'inline-block min-w-full align-middle')}>
          <table className="min-w-full text-left text-sm/6 text-zinc-950 dark:text-zinc-200">{children}</table>
        </div>
      </div>
    </TableContext.Provider>
  )
}

export function TableHead({ className, ...props }: React.ComponentPropsWithoutRef<'thead'>) {
  return (
    <thead
      {...props}
      className={clsx(
        className,
        'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200',
        'sm:sticky sm:top-0 sm:z-10'
      )}
    />
  )
}

export function TableBody(props: React.ComponentPropsWithoutRef<'tbody'>) {
  return <tbody {...props} className="bg-white dark:bg-zinc-900" />
}

const TableRowContext = createContext<{ href?: string; target?: string; title?: string }>({
  href: undefined,
  target: undefined,
  title: undefined,
})

export function TableRow({
  href,
  target,
  title,
  className,
  ...props
}: { href?: string; target?: string; title?: string } & React.ComponentPropsWithoutRef<'tr'>) {
  let { striped } = useContext(TableContext)

  return (
    <TableRowContext.Provider value={{ href, target, title } as React.ContextType<typeof TableRowContext>}>
      <tr
        {...props}
        className={clsx(
          className,
          href &&
            'has-[[data-row-link][data-focus]]:outline has-[[data-row-link][data-focus]]:outline-2 has-[[data-row-link][data-focus]]:-outline-offset-2 has-[[data-row-link][data-focus]]:outline-blue-500 dark:focus-within:bg-zinc-800',
          striped && 'even:bg-zinc-50 dark:even:bg-zinc-800/50',
          href && striped && 'hover:bg-zinc-100 dark:hover:bg-zinc-800',
          href && !striped && 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
        )}
      />
    </TableRowContext.Provider>
  )
}

export function TableHeader({ className, ...props }: React.ComponentPropsWithoutRef<'th'>) {
  let { bleed, grid } = useContext(TableContext)

  return (
    <th
      {...props}
      className={clsx(
        className,
        'border-b border-b-zinc-200 px-4 py-2 font-medium dark:border-b-zinc-700',
        'first:pl-2 last:pr-2 sm:first:pl-4 sm:last:pr-4',
        grid && 'border-l border-l-zinc-200 first:border-l-0 dark:border-l-zinc-700',
        !bleed && 'sm:first:pl-2 sm:last:pr-2'
      )}
    />
  )
}

export function TableCell({ className, children, ...props }: React.ComponentPropsWithoutRef<'td'>) {
  let { bleed, dense, grid, striped } = useContext(TableContext)
  let { href, target, title } = useContext(TableRowContext)
  let [cellRef, setCellRef] = useState<HTMLElement | null>(null)

  return (
    <td
      ref={href ? setCellRef : undefined}
      {...props}
      className={clsx(
        className,
        'relative px-4 first:pl-2 last:pr-2 sm:first:pl-4 sm:last:pr-4',
        !striped && 'border-b border-zinc-200 dark:border-zinc-700',
        grid && 'border-l border-l-zinc-200 first:border-l-0 dark:border-l-zinc-700',
        dense ? 'py-2.5' : 'py-4',
        !bleed && 'sm:first:pl-2 sm:last:pr-2'
      )}
    >
      {href && (
        <Link
          data-row-link
          href={href}
          target={target}
          aria-label={title}
          tabIndex={cellRef?.previousElementSibling === null ? 0 : -1}
          className="absolute inset-0 focus:outline-none"
        />
      )}
      {children}
    </td>
  )
}
