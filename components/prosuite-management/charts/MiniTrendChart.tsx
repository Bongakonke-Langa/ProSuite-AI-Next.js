'use client'
import { FC } from 'react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'

interface TrendDataPoint {
    value: number
    label?: string
}

interface MiniTrendChartProps {
    data: TrendDataPoint[]
    color?: string
    height?: number
}

const MiniTrendChart: FC<MiniTrendChartProps> = ({
    data,
    color = '#10B981',
    height = 32,
}) => {
    if (!data || data.length === 0) {
        return null
    }

    return (
        <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data}>
                <Line
                    type="monotone"
                    dataKey="value"
                    stroke={color}
                    strokeWidth={2}
                    dot={false}
                    animationDuration={300}
                />
            </LineChart>
        </ResponsiveContainer>
    )
}

export default MiniTrendChart
