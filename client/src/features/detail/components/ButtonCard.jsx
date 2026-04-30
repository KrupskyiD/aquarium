import React from 'react'

const ButtonCard = ({title, icon, onClick}) => {
  return (
    <button onClick={onClick} className='w-full flex items-center justify-between bg-[#121A21] p-3 rounded-2xl border border-slate-700/50 hover:bg-slate-800/50 transition-colors text-left'>
        <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-800/80 text-slate-300">
          {icon}
        </div>
        <span className="truncate text-[15px] font-medium text-slate-200">
          {title}
        </span>
      </div>
      <div className="flex shrink-0 items-center pr-1 text-slate-500">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </div>
    </button>
  )
}

export default ButtonCard