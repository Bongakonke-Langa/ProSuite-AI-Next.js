'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { MessageCircle, X, Send, Minimize2, Maximize2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import MessageRenderer from './MessageRenderer'

interface MessageContent {
    type: 'text' | 'image' | 'chart' | 'link'
    data: any
}

interface Message {
    id: string
    role: 'user' | 'assistant' | 'system'
    content: string | MessageContent[]
    timestamp: Date
}

interface MazwiChatbotProps {
    className?: string
}

export default function MazwiChatbot({ className }: MazwiChatbotProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isMinimized, setIsMinimized] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: "Hi! I'm Mazwi, your ProSuite AI assistant. I can help you with risks, assets, incidents, compliance, and more. How can I assist you today?",
            timestamp: new Date()
        }
    ])
    const [inputValue, setInputValue] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [hasNewNotification, setHasNewNotification] = useState(false)
    const [userLocation, setUserLocation] = useState<{ city: string; country: string; lat: number; lon: number } | null>(null)
    const [lastActivityTime, setLastActivityTime] = useState<number>(Date.now())
    const [queuedNotifications, setQueuedNotifications] = useState<Message[]>([])
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const notificationIntervalRef = useRef<NodeJS.Timeout | null>(null)
    const activityCheckIntervalRef = useRef<NodeJS.Timeout | null>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const playNotificationSound = useCallback(() => {
        try {
            // Create a simple notification beep using Web Audio API
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
            const oscillator = audioContext.createOscillator()
            const gainNode = audioContext.createGain()

            oscillator.connect(gainNode)
            gainNode.connect(audioContext.destination)

            // Configure the sound
            oscillator.frequency.value = 800 // Frequency in Hz
            oscillator.type = 'sine'
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

            // Play the sound
            oscillator.start(audioContext.currentTime)
            oscillator.stop(audioContext.currentTime + 0.5)
        } catch (error) {
            console.log('Could not play notification sound:', error)
        }
    }, [])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        if (isOpen && !isMinimized) {
            inputRef.current?.focus()
        }
    }, [isOpen, isMinimized])

    // Detect user location on mount
    useEffect(() => {
        const detectLocation = async () => {
            if ('geolocation' in navigator) {
                try {
                    navigator.geolocation.getCurrentPosition(
                        async (position) => {
                            const { latitude, longitude } = position.coords
                            
                            // Use reverse geocoding to get city and country
                            // In production, use a real geocoding API
                            // For now, default to Johannesburg if in South Africa region
                            const location = {
                                city: 'Johannesburg',
                                country: 'South Africa',
                                lat: latitude,
                                lon: longitude
                            }
                            
                            setUserLocation(location)
                        },
                        (error) => {
                            console.log('Location access denied, using default location')
                            // Default to Johannesburg, South Africa
                            setUserLocation({
                                city: 'Johannesburg',
                                country: 'South Africa',
                                lat: -26.2041,
                                lon: 28.0473
                            })
                        }
                    )
                } catch (error) {
                    console.log('Geolocation error:', error)
                }
            } else {
                // Default location if geolocation not supported
                setUserLocation({
                    city: 'Johannesburg',
                    country: 'South Africa',
                    lat: -26.2041,
                    lon: 28.0473
                })
            }
        }

        detectLocation()
    }, [])

    // Periodic notification check function
    const checkForNotifications = useCallback(async () => {
        try {
            // Check if user is actively chatting (activity within last 30 seconds)
            const timeSinceLastActivity = Date.now() - lastActivityTime
            const isActivelyChatting = timeSinceLastActivity < 30000 // 30 seconds
            
            // Randomly vary the query to check different aspects of the system
            const queries = [
                'check for new system alerts and critical issues',
                'show me latest alerts, reminders and news',
                'any critical risks, incidents or compliance issues?',
                'check system status for risks, assets, incidents and licenses',
                'what needs my attention across all modules?',
                'give me system health check and updates'
            ]
            
            const randomQuery = queries[Math.floor(Math.random() * queries.length)]
            
            const response = await fetch('/api/chatbot/mazwi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: randomQuery,
                    history: []
                })
            })

            const data = await response.json()
            
            // Only show notification if there's meaningful content
            if (data.response && data.response.length > 50) {
                const notificationMessage: Message = {
                    id: `notification-${Date.now()}`,
                    role: 'assistant',
                    content: `🔔 **System Notification** (${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })})\n\n${data.response}`,
                    timestamp: new Date()
                }
                
                if (isActivelyChatting) {
                    // Queue notification if user is actively chatting
                    setQueuedNotifications(prev => [...prev, notificationMessage])
                    setHasNewNotification(true)
                } else {
                    // Show notification immediately if user is not chatting
                    setMessages(prev => [...prev, notificationMessage])
                    setHasNewNotification(true)
                    playNotificationSound()
                    
                    // Auto-scroll to show new notification if chat is open
                    if (isOpen && !isMinimized) {
                        setTimeout(() => scrollToBottom(), 100)
                    }
                }
            }
        } catch (error) {
            console.error('Notification check failed:', error)
        }
    }, [playNotificationSound, lastActivityTime, isOpen, isMinimized])

    // Periodic notification system - checks for alerts and news every 2 minutes
    useEffect(() => {
        // Start periodic checks (every 2 minutes = 120000ms)
        // First check after 10 seconds, then every 2 minutes
        const initialTimeout = setTimeout(checkForNotifications, 10000)
        notificationIntervalRef.current = setInterval(checkForNotifications, 120000)

        // Cleanup on unmount
        return () => {
            clearTimeout(initialTimeout)
            if (notificationIntervalRef.current) {
                clearInterval(notificationIntervalRef.current)
            }
        }
    }, [checkForNotifications])

    // Clear notification badge when chat is opened
    useEffect(() => {
        if (isOpen && !isMinimized) {
            setHasNewNotification(false)
        }
    }, [isOpen, isMinimized])

    // Check for queued notifications and display them after inactivity
    useEffect(() => {
        activityCheckIntervalRef.current = setInterval(() => {
            const timeSinceLastActivity = Date.now() - lastActivityTime
            const isInactive = timeSinceLastActivity >= 30000 // 30 seconds of inactivity
            
            if (isInactive && queuedNotifications.length > 0) {
                // Display all queued notifications
                setMessages(prev => [...prev, ...queuedNotifications])
                setQueuedNotifications([])
                playNotificationSound()
                
                // Auto-scroll if chat is open
                if (isOpen && !isMinimized) {
                    setTimeout(() => scrollToBottom(), 100)
                }
            }
        }, 5000) // Check every 5 seconds

        return () => {
            if (activityCheckIntervalRef.current) {
                clearInterval(activityCheckIntervalRef.current)
            }
        }
    }, [lastActivityTime, queuedNotifications, isOpen, isMinimized, playNotificationSound])

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return

        // Update activity time when user sends a message
        setLastActivityTime(Date.now())

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue,
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setInputValue('')
        setIsLoading(true)

        try {
            // Send location data with the message if available
            const response = await fetch('/api/chatbot/mazwi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: inputValue,
                    history: messages,
                    location: userLocation
                })
            })

            const data = await response.json()

            // Create message content based on response type
            let messageContent: string | MessageContent[]
            
            if (data.richContent && data.richContent.length > 0) {
                // Rich content response with text, charts, images, navigation
                messageContent = [
                    { type: 'text', data: data.response },
                    ...data.richContent
                ]
            } else {
                // Simple text response
                messageContent = data.response || "I'm sorry, I couldn't process that request."
            }

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: messageContent,
                timestamp: new Date()
            }

            setMessages(prev => [...prev, assistantMessage])
        } catch (error) {
            console.error('Error sending message:', error)
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "I'm experiencing technical difficulties. Please try again later.",
                timestamp: new Date()
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    if (!isOpen) {
        return (
            <div className={cn('fixed bottom-6 right-6 z-50', className)}>
                <Button
                    onClick={() => setIsOpen(true)}
                    className="h-14 w-14 rounded-full bg-gradient-to-r from-[#006EAD] to-[#008EE0] hover:from-[#005a8c] hover:to-[#0077c0] shadow-lg hover:shadow-xl transition-all duration-300 relative"
                    size="icon"
                >
                    <MessageCircle className="h-6 w-6 text-white" />
                    {hasNewNotification && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 border-2 border-white"></span>
                        </span>
                    )}
                </Button>
            </div>
        )
    }

    return (
        <div className={cn('fixed bottom-6 right-6 z-50', className)}>
            <div
                className={cn(
                    'bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col transition-all duration-300',
                    isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-[#006EAD] to-[#008EE0] rounded-t-lg">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                            <MessageCircle className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Mazwi</h3>
                            <p className="text-xs text-blue-100">ProSuite AI Assistant</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMinimized(!isMinimized)}
                            className="h-8 w-8 text-white hover:bg-white/20"
                        >
                            {isMinimized ? (
                                <Maximize2 className="h-4 w-4" />
                            ) : (
                                <Minimize2 className="h-4 w-4" />
                            )}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsOpen(false)}
                            className="h-8 w-8 text-white hover:bg-white/20"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {!isMinimized && (
                    <>
                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={cn(
                                        'flex',
                                        message.role === 'user' ? 'justify-end' : 'justify-start'
                                    )}
                                >
                                    <div
                                        className={cn(
                                            'max-w-[80%] rounded-lg px-4 py-2',
                                            message.role === 'user'
                                                ? 'bg-[#006EAD] text-white'
                                                : 'bg-gray-100 text-gray-900'
                                        )}
                                    >
                                        <MessageRenderer content={message.content} />
                                        <p className="text-xs mt-1 opacity-70">
                                            {message.timestamp.toLocaleTimeString('en-GB', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-100 rounded-lg px-4 py-2">
                                        <Loader2 className="h-5 w-5 animate-spin text-[#006EAD]" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t">
                            <div className="flex gap-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => {
                                        setInputValue(e.target.value)
                                        setLastActivityTime(Date.now()) // Track typing activity
                                    }}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Ask Mazwi anything..."
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006EAD] text-sm text-gray-900 placeholder:text-gray-400"
                                    disabled={isLoading}
                                />
                                <Button
                                    onClick={handleSendMessage}
                                    disabled={!inputValue.trim() || isLoading}
                                    className="bg-[#006EAD] hover:bg-[#005a8c] text-white"
                                    size="icon"
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
