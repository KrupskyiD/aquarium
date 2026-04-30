import React from 'react'
import { AreaChart, Area, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const MetricCard = ({ value, status, name, unit }) => {

    const mockGraphData = [
        { value: 34.2 }, { value: 34.3 }, { value: 34.5 },
        { value: 34.4 }, { value: 34.7 }, { value: 34.8 }
    ];

    const isNormal = status?.text === "v normě";
    const statusColorClasses = isNormal
      ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
      : "bg-orange-500/10 border border-orange-500/20 text-orange-300";
    const statusArrow = isNormal ? "•" : "▼";

    return (
            <div className='relative flex w-full flex-col overflow-hidden rounded-2xl border border-slate-700/50 bg-[#0C1A28]'>
                <div className='p-4 pb-2'>
                    <div className='mb-2 flex items-center justify-between gap-3'>
                        <span className='text-slate-400 text-xs font-semibold tracking-wider uppercase'>
                            {name}
                        </span>
                        <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${statusColorClasses}`}>
                            <span className='text-[10px]'>{statusArrow}</span>
                            <span>{status.text}</span>
                        </div>
                    </div>
                    <div className='relative z-10 flex items-end justify-between'>
                        <div className='flex items-baseline gap-1'>
                            <span className='text-4xl font-light tracking-tight text-white'>{value}</span>
                            <span className='text-sm text-slate-400'>{unit}</span>
                        </div>
                        <button type="button" className='mb-1 text-slate-500 transition-colors hover:text-white'>
                            <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                                <path d='M9 18l6-6-6-6' />
                            </svg>
                        </button>
                    </div>
                </div>

                {/*graphs*/}
                <div className='mt-auto h-12 w-full'>
                    <ResponsiveContainer width='100%' height='100%'>
                        <AreaChart
                            data={mockGraphData}
                            margin={{
                                top: 0,
                                right: 0,
                                left: 0,
                                bottom: 0,
                            }}
                        >
                            <defs>
                                <linearGradient id='colorValue' x1='0' y1='0' x2='0' y2='1'>
                                    <stop offset='5%' stopColor='#3B82F6' stopOpacity={0.3}/>
                                    <stop offset='95%' stopColor='#3B82F6' stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <YAxis hide domain={['dataMin', 'dataMax']}/>
                            <Tooltip contentStyle={{backgroundColor: '#121A21', borderColor: '#334155', color: '#fff'}}
                            itemStyle={{color: '#3B82F6'}}
                            />
                            <Area type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                        </AreaChart>
                    </ResponsiveContainer>

                </div>
            </div>
    )
}

export default MetricCard