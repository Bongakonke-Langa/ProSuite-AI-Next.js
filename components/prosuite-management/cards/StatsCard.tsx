import { FC } from 'react'
import { cn } from '@/lib/utils'
import CardContentSkeleton from './CardContentSkeleton'
import MiniTrendChart from '../charts/MiniTrendChart'

interface TrendDataPoint {
    value: number
    label?: string
}

interface StatsCardProps {
    title: string
    number: number | string
    icon: React.ReactNode
    statColor?: string
    titleColor?: string
    trendTextColor?: string
    positiveTrendColor?: string
    negativeTrendColor?: string
    lastMonthDifference?: number
    isHealthScore?: boolean
    trendData?: TrendDataPoint[]
    showTrendChart?: boolean
    trendChartColor?: string
    trendChartHeight?: number
    loading?: boolean
    href?: string
}

export const StatsCard: FC<StatsCardProps> = ({
    title,
    number,
    icon,
    statColor = '',
    titleColor = '',
    trendTextColor = '',
    positiveTrendColor = 'text-emerald-500',
    negativeTrendColor = 'text-red-500',
    lastMonthDifference = 0,
    isHealthScore = false,
    trendData = [],
    showTrendChart = true,
    trendChartColor = '#10B981',
    trendChartHeight = 32,
    loading = false,
    href,
}) => {
    const isPositive = lastMonthDifference >= 0
    const trendColor = isPositive ? positiveTrendColor : negativeTrendColor

    const shouldShowTrend = showTrendChart !== false && typeof number === 'number' && number > 0

    const finalTrendData =
        trendData.length > 0
            ? trendData
            : (() => {
                  if (typeof number !== 'number' || number <= 0) return []

                  const currentValue = number
                  const baseValue = Math.max(1, currentValue - currentValue * 0.3)
                  const dataPoints = 6
                  const increment = (currentValue - baseValue) / (dataPoints - 1)

                  const now = new Date()
                  const monthNames = [
                      'Jan',
                      'Feb',
                      'Mar',
                      'Apr',
                      'May',
                      'Jun',
                      'Jul',
                      'Aug',
                      'Sep',
                      'Oct',
                      'Nov',
                      'Dec',
                  ]

                  const generatedData = []
                  for (let i = 0; i < dataPoints; i++) {
                      const monthIndex = (now.getMonth() - (dataPoints - 1) + i + 12) % 12
                      const value =
                          i === dataPoints - 1
                              ? currentValue
                              : Math.round(baseValue + increment * i)
                      generatedData.push({
                          value,
                          label: monthNames[monthIndex],
                      })
                  }

                  return generatedData
              })()

    if (loading) {
        return (
            <div className="relative p-3 xxxs:p-4 lg:p-5">
                <CardContentSkeleton type="single-stat" height="h-auto" />
            </div>
        )
    }

    return (
        <div className="relative p-3 xxxs:p-4 lg:p-5 group">
            <div className="relative flex items-center justify-between gap-2 xxxs:gap-3 md:gap-4">
                {/* Main Content */}
                <div className="flex items-center gap-2 xxxs:gap-3 md:gap-4 flex-1">
                    {!loading && href && (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="absolute right-0 top-0 opacity-0 group-has-[a:hover]:opacity-100 transition-opacity text-emerald-500"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="7" y1="17" x2="17" y2="7" />
                            <polyline points="7 7 17 7 17 17" />
                        </svg>
                    )}
                    <div className={cn('shrink-0', statColor)}>{icon}</div>
                    <div>
                        {href ? (
                            <a
                                href={href}
                                className={cn(
                                    'font-medium tracking-widest text-[10px] xxxs:text-xs uppercase before:absolute before:inset-0',
                                    titleColor || 'text-gray-500/60'
                                )}
                            >
                                {title}
                            </a>
                        ) : (
                            <div
                                className={cn(
                                    'font-medium tracking-widest text-[10px] xxxs:text-xs uppercase',
                                    titleColor || 'text-gray-500/60'
                                )}
                            >
                                {title}
                            </div>
                        )}
                        {loading ? (
                            <div className="flex items-center justify-start my-2">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-700" />
                            </div>
                        ) : (
                            <>
                                <div className="text-lg xxxs:text-xl md:text-2xl font-semibold text-gray-900">
                                    {isHealthScore ? `${number}%` : number}
                                </div>
                                <div
                                    className={cn(
                                        'text-[10px] xxxs:text-xs',
                                        trendTextColor || 'text-muted-foreground/60'
                                    )}
                                >
                                    <span className={cn('font-medium', trendColor)}>
                                        {isPositive ? '↗' : '↘'} {Math.abs(lastMonthDifference)}%
                                    </span>{' '}
                                    vs last month
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Trend Chart */}
                {!loading && shouldShowTrend && finalTrendData.length > 0 && (
                    <div className="shrink-0 w-24 h-12 self-end -mb-1 -mr-2 xxxs:-mr-3">
                        <MiniTrendChart
                            data={finalTrendData}
                            color={trendChartColor}
                            height={trendChartHeight}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

interface StatsGridProps {
    stats: StatsCardProps[]
}

export function StatsGrid({ stats }: StatsGridProps) {
    const getGridCols = (count: number) => {
        if (count === 1) return 'grid-cols-1'
        if (count === 2) return 'grid-cols-1 xxxs:grid-cols-2'
        if (count === 3) return 'grid-cols-1 xxxs:grid-cols-2 md:grid-cols-3'
        return 'grid-cols-1 xxxs:grid-cols-2 md:grid-cols-4'
    }
    const shouldShowVerticalDivider = (index: number, total: number) => {
        return index < total - 1
    }

    const shouldShowVerticalDividerSmall = (index: number, total: number) => {
        if (total === 1) return false
        return index % 2 === 0 && index < total - 1
    }

    return (
        <div
            className={cn(
                'relative grid border border-gray-200 rounded-xl bg-[#F9FAFB]',
                getGridCols(stats.length),
                stats.length >= 4 && 'min-h-[120px]'
            )}
        >
            {stats.map((stat, index) => (
                <div
                    key={stat.title}
                    className={cn('relative', [
                        'before:absolute before:right-0 before:top-1/2 before:-translate-y-1/2',
                        'before:h-[56px] before:w-[1px] before:bg-gradient-to-b',
                        'before:from-gray-300/30 before:via-gray-300 before:to-gray-300/30',
                        'before:hidden',
                        shouldShowVerticalDivider(index, stats.length) && 'md:before:block',
                        shouldShowVerticalDividerSmall(index, stats.length) && 'xxxs:before:block',
                    ])}
                >
                    <StatsCard {...stat} />
                </div>
            ))}
        </div>
    )
}

export default StatsCard
