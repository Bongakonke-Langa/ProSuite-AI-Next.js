import { FC } from 'react'
import { cn } from '@/lib/utils'

interface CardContentSkeletonProps {
    type?: 'single-stat' | 'multi-stat' | 'chart' | 'table'
    height?: string
    className?: string
}

const CardContentSkeleton: FC<CardContentSkeletonProps> = ({
    type = 'single-stat',
    height = 'h-24',
    className,
}) => {
    if (type === 'single-stat') {
        return (
            <div className={cn('animate-pulse space-y-3', className)}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                    <div className="flex-1 space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-24" />
                        <div className="h-6 bg-gray-200 rounded w-16" />
                        <div className="h-2 bg-gray-200 rounded w-20" />
                    </div>
                </div>
            </div>
        )
    }

    if (type === 'multi-stat') {
        return (
            <div className={cn('animate-pulse grid grid-cols-2 gap-4', className)}>
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-20" />
                        <div className="h-6 bg-gray-200 rounded w-16" />
                    </div>
                ))}
            </div>
        )
    }

    if (type === 'chart') {
        return (
            <div className={cn('animate-pulse', height, className)}>
                <div className="h-full bg-gray-200 rounded" />
            </div>
        )
    }

    if (type === 'table') {
        return (
            <div className={cn('animate-pulse space-y-3', className)}>
                <div className="h-10 bg-gray-200 rounded" />
                <div className="h-8 bg-gray-200 rounded" />
                <div className="h-8 bg-gray-200 rounded" />
                <div className="h-8 bg-gray-200 rounded" />
            </div>
        )
    }

    return (
        <div className={cn('animate-pulse', height, className)}>
            <div className="h-full bg-gray-200 rounded" />
        </div>
    )
}

export default CardContentSkeleton
