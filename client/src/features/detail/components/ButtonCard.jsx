import React from 'react'

const ButtonCard = ({title, icon, onClick}) => {
  return (
    <button onClick={onClick} className='w-full flex items-center justify-between bg-[#0C1A28] p-3 rounded-2xl border border-slate-700/50 hover:bg-slate-800/50 transition-colors text-left'>
        <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-slate-800/80 flex items-center justify-center text-slate-300">
          {icon}
        </div>
        <span className="text-slate-200 text-[15px] font-medium">
          {title}
        </span>
      </div>
      <div className="text-slate-500 pr-2">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </div>
    </button>
  )
}

export default ButtonCard