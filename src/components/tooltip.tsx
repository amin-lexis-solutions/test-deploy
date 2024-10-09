const Tooltip = ({ children, text }: { children: any; text: string }) => {
  return (
    <div className="group relative">
      {children}
      <div className="absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 transform rounded-lg bg-gray-500 px-2 py-1 text-xs text-white group-hover:block dark:bg-gray-800">
        {text}
      </div>
    </div>
  )
}

export default Tooltip
