import React from 'react'
import { AreaChart, Area, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const TOOLTIP_WIDTH = 92;

const ChartTooltip = ({ active, payload, unit, coordinate, viewBox }) => {
    if (!active || !payload?.length) return null;

    const value = Number(payload[0]?.value).toFixed(1);
    const pointX = coordinate?.x ?? 0;
    const chartLeft = viewBox?.x ?? 0;
    const chartWidth = viewBox?.width ?? 0;
    const rightEdge = chartLeft + chartWidth;
    const shouldFlipLeft = pointX + TOOLTIP_WIDTH > rightEdge - 8;
    const shouldPushRight = pointX < chartLeft + 8;

    let xTranslateClass = "-translate-x-1/2";
    if (shouldFlipLeft) xTranslateClass = "-translate-x-full -translate-x-2";
    if (shouldPushRight) xTranslateClass = "translate-x-2";

    return (
        <div className={`rounded-md border border-slate-600/70 bg-[#071322]/95 px-2.5 py-1.5 text-xs font-medium text-slate-100 shadow-lg backdrop-blur-sm ${xTranslateClass}`}>
            {value} {unit}
        </div>
    );
};

const MetricCard = ({ value, status, name, unit, onClick, graphData = [] }) => {

    const isNormal = status?.text === "v normě";
    const statusColorClasses = isNormal
      ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
      : "bg-orange-500/10 border border-orange-500/20 text-orange-300";
    const statusArrow = isNormal ? "•" : "▼";

    const displayData = graphData.length > 0 ? graphData : [{ value: Number(value) || 0 }];

    return (
            <button
                type="button"
                onClick={onClick}
                className='relative z-0 flex w-full flex-col overflow-visible rounded-2xl border border-slate-700/50 bg-[#0C1A28] text-left transition-colors hover:border-slate-600/70'
            >
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
                        <span className='mb-1 text-slate-500 transition-colors'>
                            <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                                <path d='M9 18l6-6-6-6' />
                            </svg>
                        </span>
                    </div>
                </div>

                {/*graphs*/}
                <div className='relative z-10 mt-auto h-12 w-full overflow-visible'>
                    <ResponsiveContainer width='100%' height='100%'>
                        <AreaChart
                            data={displayData}
                            margin={{
                                top: 0,
                                right: 10,
                                left: 10,
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
                            <Tooltip
                            content={(props) => <ChartTooltip {...props} unit={unit} />}
                            cursor={{ stroke: '#7fb2ff', strokeWidth: 1, strokeOpacity: 0.8 }}
                            offset={20}
                            allowEscapeViewBox={{ x: false, y: true }}
                            wrapperStyle={{ zIndex: 40, pointerEvents: 'none' }}
                            />
                            <Area type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                        </AreaChart>
                    </ResponsiveContainer>

                </div>
            </button>
    )
}

export default MetricCard