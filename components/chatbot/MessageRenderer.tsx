'use client'

import Link from 'next/link'
import Image from 'next/image'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { ExternalLink } from 'lucide-react'

interface MessageContent {
    type: 'text' | 'image' | 'chart' | 'link' | 'navigation'
    data: any
}

interface MessageRendererProps {
    content: string | MessageContent[]
}

export default function MessageRenderer({ content }: MessageRendererProps) {
    if (typeof content === 'string') {
        return <p className="text-sm whitespace-pre-wrap">{content}</p>
    }

    return (
        <div className="space-y-3">
            {content.map((item, index) => {
                switch (item.type) {
                    case 'text':
                        return (
                            <p key={index} className="text-sm whitespace-pre-wrap">
                                {item.data}
                            </p>
                        )

                    case 'image':
                        return (
                            <div key={index} className="rounded-lg overflow-hidden">
                                <Image
                                    src={item.data.src}
                                    alt={item.data.alt || 'Image'}
                                    width={item.data.width || 300}
                                    height={item.data.height || 200}
                                    className="w-full h-auto"
                                />
                            </div>
                        )

                    case 'chart':
                        return (
                            <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                                {item.data.chartType === 'pie' && (
                                    <ResponsiveContainer width="100%" height={200}>
                                        <PieChart>
                                            <Pie
                                                data={item.data.data}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                outerRadius={60}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {item.data.data.map((entry: any, idx: number) => (
                                                    <Cell key={`cell-${idx}`} fill={entry.color || `hsl(${idx * 45}, 70%, 50%)`} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                )}
                                {item.data.chartType === 'bar' && (
                                    <ResponsiveContainer width="100%" height={200}>
                                        <BarChart data={item.data.data}>
                                            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                            <YAxis tick={{ fontSize: 10 }} />
                                            <Tooltip />
                                            <Bar dataKey="value" fill="#006EAD" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                                {item.data.title && (
                                    <p className="text-xs text-gray-600 text-center mt-2">{item.data.title}</p>
                                )}
                            </div>
                        )

                    case 'link':
                        return (
                            <a
                                key={index}
                                href={item.data.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                            >
                                {item.data.text}
                                <ExternalLink className="h-3 w-3" />
                            </a>
                        )

                    case 'navigation':
                        return (
                            <Link
                                key={index}
                                href={item.data.path}
                                className="block w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-blue-900">{item.data.title}</p>
                                        <p className="text-xs text-blue-700 mt-1">{item.data.description}</p>
                                    </div>
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </Link>
                        )

                    default:
                        return null
                }
            })}
        </div>
    )
}
