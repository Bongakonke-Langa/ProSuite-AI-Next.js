'use client'

import Image from 'next/image'
import { Card } from '@/components/ui/card'
import React, { useEffect, useState, Suspense } from 'react'
import { useAuth } from '@/hooks/prosuite-management/auth'
import useTasks from '@/hooks/prosuite-management/useTasks'
import { List, Loader, CheckCircle } from 'lucide-react'
import { Task, CreateTaskData, UpdateTaskData } from '@/types/task'
import TaskCard from '@/components/prosuite-management/tasks/TaskCard'
import TaskModal from '@/components/prosuite-management/tasks/TaskModal'
import { Tabs, TabsList, TabsTrigger, TabsContent, } from '@/components/ui/tabs'
import TaskCardSkeleton from '@/components/prosuite-management/tasks/TaskCardSkeleton'
import RecentActivities from '@/components/prosuite-management/layout/RecentActivities'
import PageSectionHeader from '@/components/prosuite-management/layout/PageSectionHeader'
import { useSearchParams, useRouter } from 'next/navigation'

const getGreeting = (): string => {
    const now = new Date()
    const currentHour = now.getHours()

    if (currentHour >= 5 && currentHour < 12) return 'Good morning'
    else if (currentHour >= 12 && currentHour < 17) return 'Good afternoon'
    else return 'Good evening'
}

const HomeContent: React.FC = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { user } = useAuth({ middleware: 'auth' })
    const [greeting, setGreeting] = useState<string>(getGreeting())
    const { tasks, loading, createTask, updateTask, updateTaskStatus, validationErrors, refetch } = useTasks()

    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
    const [selectedTask, setSelectedTask] = useState<Task | null>(null)
    const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create')
    const [taskFetchRetried, setTaskFetchRetried] = useState(false)

    const newTasks = tasks.filter(t => t.status === 'New')
    const inProgressTasks = tasks.filter(t => t.status === 'In Progress')
    const completedTasks = tasks.filter(t => t.status === 'Completed')

    useEffect(() => {
        const updateGreeting = () => {
            setGreeting(getGreeting())
        }

        updateGreeting()

        const interval = setInterval(updateGreeting, 60000)

        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        const taskId = searchParams?.get('taskId')

        if (taskId && tasks.length > 0 && !loading) {
            const task = tasks.find(t => t.id === Number(taskId))

            if (task) {
                console.log('[Home] useEffect: task found', task)
                
                setSelectedTask(task)
                setModalMode('view')
                setIsTaskModalOpen(true)

                router.replace('/prosuite-management/home')
                setTaskFetchRetried(false)
            } else if (!taskFetchRetried) {
                setTaskFetchRetried(true)
                refetch(undefined, true)
            } else {
                router.replace('/prosuite-management/home')
            }
        }
    }, [searchParams, tasks, loading, router, refetch, taskFetchRetried])

    const handleCreateTask = () => {
        setSelectedTask(null)
        setModalMode('create')
        setIsTaskModalOpen(true)
    }

    const handleViewTask = (task: Task) => {
        setSelectedTask(task)
        setModalMode('view')
        setIsTaskModalOpen(true)
    }

    const handleModeChange = (mode: 'edit' | 'view') => {
        setModalMode(mode)
    }

    const handleTaskSubmit = async (data: CreateTaskData | UpdateTaskData) => {
        let result = null
        if (modalMode === 'create') {
            result = await createTask(data as CreateTaskData)
        } else if (modalMode === 'edit' && selectedTask) {
            result = await updateTask(selectedTask.id, data)
        }

        if (result) {
            setIsTaskModalOpen(false)
        }
    }

    const handleStatusChange = async (taskId: number, newStatus: 'In Progress' | 'Completed') => {
        await updateTaskStatus(taskId, newStatus)
    }

    return (
        <div className="w-full flex">
            <div className="flex-grow">
                <div className="w-full relative bg-prosuite-500 from-[#017DC5] to-[#008EE0] rounded-lg mb-6 sm:mb-8 lg:mb-10 px-4 sm:px-6 lg:px-10 py-6 sm:py-12 lg:py-20 overflow-hidden">
                    <h2 className="text-white text-lg sm:text-2xl lg:text-4xl font-bold leading-tight">
                        {user?.name ? (
                            <>{greeting} {user.name}</>
                        ) : (
                            <span className="flex items-center gap-2 sm:gap-3">
                                <span className="inline-block h-[1.75rem] sm:h-[2rem] lg:h-[2.5rem] w-[120px] sm:w-[160px] lg:w-[200px] bg-white/20 rounded animate-pulse" />
                                <span className="inline-block h-[1.75rem] sm:h-[2rem] lg:h-[2.5rem] w-[100px] sm:w-[140px] lg:w-[180px] bg-white/20 rounded animate-pulse" />
                            </span>
                        )}
                    </h2>
                    <p className="text-blue-100 sm:text-blue-300 font-normal mt-2 text-sm sm:text-lg lg:text-2xl leading-relaxed">
                        Welcome to your <span className="italic font-bold">ProSuite</span> activity feed
                    </p>
                    <div className="absolute -right-1 sm:-right-2 top-2 sm:top-4">
                        <Image
                            src="/prosuite-logo.svg"
                            alt="ProSuite"
                            width={233}
                            height={233}
                            className="w-[60px] sm:w-[120px] lg:w-[233px] opacity-30 sm:opacity-50"
                        />
                    </div>
                </div>

                <div className="w-full flex flex-col lg:flex-row lg:space-x-6 xl:space-x-8 space-y-4 sm:space-y-6 lg:space-y-0 mb-6 sm:mb-8 lg:mb-10">
                    <Card className="flex-1 min-w-0 min-h-[350px] sm:min-h-[400px] p-3 sm:p-6 lg:p-8">
                        <PageSectionHeader
                            title="Activity"
                            subTitle="Recent ProSuite events, actions, and incidents"
                            showImportExport={false}
                        />

                        <RecentActivities />
                    </Card>

                    <Card className="flex-1 min-w-0 p-3 sm:p-6 lg:p-8">
                        <Tabs defaultValue="newTasks">
                            <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
                                <PageSectionHeader
                                    title="Tasks"
                                    subTitle="Outstanding ProSuite tasks and todos"
                                    showImportExport={false}
                                    customAction={{
                                        action: handleCreateTask,
                                    }}
                                />

                                <TabsList className="bg-gray-100 w-full rounded-lg p-1 grid grid-cols-3 gap-1">
                                    <TabsTrigger
                                        value="newTasks"
                                        className="group data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md py-2.5 px-4 text-sm font-medium text-gray-700 transition-all flex items-center justify-center"
                                    >
                                        <List size={16} className="mr-2 text-gray-500 group-data-[state=active]:text-[#006EAD]" />
                                        <span className="text-gray-700">New Tasks</span>
                                        {newTasks.length > 0 && (
                                            <span className="ml-2 text-gray-500">
                                                {newTasks.length}
                                            </span>
                                        )}
                                    </TabsTrigger>

                                    <TabsTrigger
                                        value="inProgress"
                                        className="group data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md py-2.5 px-4 text-sm font-medium text-gray-700 transition-all flex items-center justify-center"
                                    >
                                        <Loader size={16} className="mr-2 text-gray-500 group-data-[state=active]:text-[#006EAD]" />
                                        <span className="text-gray-700">In Progress</span>
                                        {inProgressTasks.length > 0 && (
                                            <span className="ml-2 text-gray-500">
                                                {inProgressTasks.length}
                                            </span>
                                        )}
                                    </TabsTrigger>

                                    <TabsTrigger
                                        value="completed"
                                        className="group data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md py-2.5 px-4 text-sm font-medium text-gray-700 transition-all flex items-center justify-center"
                                    >
                                        <CheckCircle size={16} className="mr-2 text-gray-500 group-data-[state=active]:text-[#006EAD]" />
                                        <span className="text-gray-700">Completed</span>
                                        {completedTasks.length > 0 && (
                                            <span className="ml-2 text-gray-500">
                                                {completedTasks.length}
                                            </span>
                                        )}
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <TabsContent value="newTasks">
                                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                                    {loading ? (
                                        <>
                                            <TaskCardSkeleton />
                                            <TaskCardSkeleton />
                                            <TaskCardSkeleton />
                                        </>
                                    ) : newTasks.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-60 text-center">
                                            <List className="h-12 w-12 text-gray-300 mb-3" />
                                            <p className="text-gray-500 font-medium">No new tasks</p>
                                            <p className="text-gray-400 text-sm mt-1">Create a new task to get started</p>
                                        </div>
                                    ) : (
                                        newTasks.map(task => (
                                            <TaskCard
                                                key={task.id}
                                                task={task}
                                                onClick={() => handleViewTask(task)}
                                                onStatusChange={handleStatusChange}
                                            />
                                        ))
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="inProgress">
                                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                                    {loading ? (
                                        <>
                                            <TaskCardSkeleton />
                                            <TaskCardSkeleton />
                                            <TaskCardSkeleton />
                                        </>
                                    ) : inProgressTasks.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-60 text-center">
                                            <Loader className="h-12 w-12 text-gray-300 mb-3" />
                                            <p className="text-gray-500 font-medium">No tasks in progress</p>
                                            <p className="text-gray-400 text-sm mt-1">Start working on a task</p>
                                        </div>
                                    ) : (
                                        inProgressTasks.map(task => (
                                            <TaskCard
                                                key={task.id}
                                                task={task}
                                                onClick={() => handleViewTask(task)}
                                                onStatusChange={handleStatusChange}
                                            />
                                        ))
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="completed">
                                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                                    {loading ? (
                                        <>
                                            <TaskCardSkeleton />
                                            <TaskCardSkeleton />
                                            <TaskCardSkeleton />
                                        </>
                                    ) : completedTasks.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-60 text-center">
                                            <CheckCircle className="h-12 w-12 text-gray-300 mb-3" />
                                            <p className="text-gray-500 font-medium">No completed tasks</p>
                                            <p className="text-gray-400 text-sm mt-1">Complete tasks to see them here</p>
                                        </div>
                                    ) : (
                                        completedTasks.map(task => (
                                            <TaskCard
                                                key={task.id}
                                                task={task}
                                                onClick={() => handleViewTask(task)}
                                                onStatusChange={handleStatusChange}
                                            />
                                        ))
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </Card>
                </div>

                <TaskModal
                    isOpen={isTaskModalOpen}
                    onClose={() => setIsTaskModalOpen(false)}
                    onSubmit={handleTaskSubmit}
                    task={selectedTask}
                    mode={modalMode}
                    validationErrors={validationErrors}
                    onModeChange={handleModeChange}
                />
            </div>
        </div>
    )
}

const Home: React.FC = () => {
    return (
        <Suspense fallback={
            <div className="w-full flex items-center justify-center min-h-screen">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
            </div>
        }>
            <HomeContent />
        </Suspense>
    )
}

export default Home
