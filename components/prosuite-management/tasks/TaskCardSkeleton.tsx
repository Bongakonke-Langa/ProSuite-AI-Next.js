export default function TaskCardSkeleton() {
    return (
        <div className="p-4 bg-white border border-gray-200 rounded-lg animate-pulse">
            <div className="flex items-start justify-between mb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="w-8 h-8 bg-gray-200 rounded-full" />
            </div>
            <div className="space-y-2 mb-3">
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
            </div>
            <div className="flex items-center gap-2 mb-2">
                <div className="h-5 bg-gray-200 rounded w-24" />
                <div className="h-5 bg-gray-200 rounded w-20" />
            </div>
            <div className="flex items-center justify-between">
                <div className="h-3 bg-gray-200 rounded w-16" />
                <div className="h-3 bg-gray-200 rounded w-20" />
            </div>
        </div>
    )
}
