'use client'

import { useState, useRef, useEffect } from 'react'
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
    const [inputMessage, setInputMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        if (isOpen && !isMinimized) {
            inputRef.current?.focus()
        }
    }, [isOpen, isMinimized])

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputMessage,
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setInputMessage('')
        setIsLoading(true)

        try {
            // Call the AI API endpoint
            const response = await fetch('/api/chatbot/mazwi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: inputMessage,
                    history: messages
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
                    className="h-14 w-14 rounded-full bg-gradient-to-r from-[#006EAD] to-[#008EE0] hover:from-[#005a8c] hover:to-[#0077c0] shadow-lg hover:shadow-xl transition-all duration-300"
                    size="icon"
                >
                    <MessageCircle className="h-6 w-6 text-white" />
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
                                            {message.timestamp.toLocaleTimeString([], {
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
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Ask Mazwi anything..."
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006EAD] text-sm text-gray-900 placeholder:text-gray-400"
                                    disabled={isLoading}
                                />
                                <Button
                                    onClick={handleSendMessage}
                                    disabled={!inputMessage.trim() || isLoading}
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
