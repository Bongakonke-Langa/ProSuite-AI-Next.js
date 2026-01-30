'use client'

import React from 'react'

interface UniversalChartProps {
    type: 'pie' | 'donut' | 'bar' | 'horizontalBar' | 'line'
    data: any[]
    config: {
        nameKey?: string
        valueKey?: string
        xAxisKey?: string
        yAxisKeys?: Array<{ dataKey: string; name: string; color: string }>
        colors?: string[]
        loading?: boolean
        height?: number
        showLegend?: boolean
        legendPosition?: 'top' | 'bottom' | 'left' | 'right'
        showLabel?: boolean
        labelPosition?: 'top' | 'bottom' | 'left' | 'right' | 'inside'
        formatter?: (value: any, params?: any) => string
        truncateLabel?: boolean
        maxLabelLength?: number
    }
}

export const UniversalChart: React.FC<UniversalChartProps> = ({ type, data, config }) => {
    const { height = 300 } = config

    return (
        <div 
            className="flex items-center justify-center text-gray-500 text-sm"
            style={{ height: `${height}px` }}
        >
            <div className="text-center">
                <p className="font-medium">Chart: {type}</p>
                <p className="text-xs mt-2">{data.length} data points</p>
                <p className="text-xs text-gray-400 mt-1">ECharts integration required</p>
            </div>
        </div>
    )
}
