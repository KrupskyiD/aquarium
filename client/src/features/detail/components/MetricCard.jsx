import React from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MetricCard = ({ value, status, name, unit }) => {

    const mockGraphData = [
        { value: 34.2 }, { value: 34.3 }, { value: 34.5 },
        { value: 34.4 }, { value: 34.7 }, { value: 34.8 }
    ];

    return (
  
            /*container*/
            <div className='bg-[#0C1A28] rounded-2xl border border-slate-700/50 overflow-hidden flex flex-col relative w-full'>
                <div className='p-4 pb-2'>
                    <div className='flex justify-between items-center mb-2'>
                        <span className='text-slate-400 text-xs font-semibold tracking-wider uppercase'>
                            {name}
                        </span>
                        {/*statuses pod cilem v norme a nad cilem*/}
                        <div className='flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/10 border-orange-500/20'>
                            <span className='text-orange-400 text-[10px]'>▼</span>
                            <span className='text-orange-400 text-xs font-medium'>{status.text}</span>
                        </div>
                    </div>
                    <div className='flex justify-between items-end z-10 relative'>
                        <div className='flex items-baseline gap-1'>
                            <span className='text-4xl text-white font-light tracking-tight'>{value}</span>
                            <span className='text-slate-400 text-sm'>{unit}</span>
                        </div>
                        <button className='text-slate-500 mb-1 hover:text-white transition-colors'>
                            <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                                <path d='M9 18l6-6-6-6' />
                            </svg>
                        </button>
                    </div>
                </div>

                {/*graphs*/}
                <div className='h-12 w-full mt-auto'>
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