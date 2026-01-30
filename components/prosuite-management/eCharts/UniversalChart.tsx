'use client'

import React from 'react'
import { PieChart, Pie, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

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

const COLORS = ['#059669', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#6366F1', '#14B8A6']

export const UniversalChart: React.FC<UniversalChartProps> = ({ type, data, config }) => {
    const {
        nameKey = 'name',
        valueKey = 'value',
        xAxisKey = 'name',
        yAxisKeys = [],
        colors = COLORS,
        height = 300,
        showLegend = true,
        legendPosition = 'bottom',
        showLabel = false,
    } = config

    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center text-gray-400 text-sm" style={{ height: `${height}px` }}>
                No data available
            </div>
        )
    }

    // Pie and Donut Charts
    if (type === 'pie' || type === 'donut') {
        return (
            <ResponsiveContainer width="100%" height={height}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={showLabel}
                        outerRadius={type === 'donut' ? 80 : 100}
                        innerRadius={type === 'donut' ? 50 : 0}
                        fill="#8884d8"
                        dataKey={valueKey}
                        nameKey={nameKey}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color || colors[index % colors.length]} />
                        ))}
                    </Pie>
                    {showLegend && <Legend verticalAlign={legendPosition === 'bottom' ? 'bottom' : 'top'} />}
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        )
    }

    // Bar Charts (Vertical)
    if (type === 'bar') {
        return (
            <ResponsiveContainer width="100%" height={height}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={xAxisKey} />
                    <YAxis />
                    <Tooltip />
                    {showLegend && <Legend />}
                    {yAxisKeys.map((yAxis, index) => (
                        <Bar key={index} dataKey={yAxis.dataKey} fill={yAxis.color} name={yAxis.name} />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        )
    }

    // Bar Charts (Horizontal)
    if (type === 'horizontalBar') {
        return (
            <ResponsiveContainer width="100%" height={height}>
                <BarChart data={data} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey={xAxisKey} type="category" width={100} />
                    <Tooltip />
                    {showLegend && <Legend />}
                    {yAxisKeys.map((yAxis, index) => (
                        <Bar key={index} dataKey={yAxis.dataKey} fill={yAxis.color} name={yAxis.name} />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        )
    }

    return null
}
