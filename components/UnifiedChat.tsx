import React, { useState, useRef, useEffect } from 'react';
import { Icon } from './Icon';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
}

interface UnifiedChatProps {
    activeConnectors: string[];
}

export const UnifiedChat: React.FC<UnifiedChatProps> = ({ activeConnectors }) => {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Welcome! I can help you query your active data sources. How can I assist?", sender: 'bot' },
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() === '') return;

        const newUserMessage: Message = { id: Date.now(), text: input, sender: 'user' };
        const botResponse: Message = { 
            id: Date.now() + 1, 
            text: `Querying ${activeConnectors.join(', ')}... (This is a mock response).`, 
            sender: 'bot' 
        };
        
        setMessages([...messages, newUserMessage, botResponse]);
        setInput('');
    };

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-800">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Unified Chat</h3>
                 <p className="text-xs text-gray-500 dark:text-gray-400">
                    Active Sources: {activeConnectors.length > 0 ? activeConnectors.join(', ') : 'None'}
                </p>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                    <div key={message.id} className={`flex items-end gap-2 ${message.sender === 'user' ? 'justify-end' : ''}`}>
                        {message.sender === 'bot' && (
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0 text-sm">
                                AI
                            </div>
                        )}
                        <div
                            className={`px-4 py-2 rounded-lg max-w-xs lg:max-w-md shadow-sm ${
                                message.sender === 'user'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100'
                            }`}
                        >
                            <p className="text-sm">{message.text}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <form onSubmit={handleSend} className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about your connected data..."
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button type="submit" className="p-2 rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <Icon name="send" className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};