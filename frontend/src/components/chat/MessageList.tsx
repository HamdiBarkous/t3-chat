/**
 * Message List Component
 * Displays a scrollable list of messages with auto-scroll to bottom
 */

'use client';

import React, { useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble';
import type { Message } from '@/types/api';

interface MessageListProps {
  messages: Message[];
  streamingMessageId?: string;
  isLoading?: boolean;
  isLoadingConversation?: boolean;
}

export function MessageList({ 
  messages, 
  streamingMessageId,
  isLoading = false,
  isLoadingConversation = false
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive or streaming starts
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, streamingMessageId]);

  // Auto-scroll during streaming when content is being added
  useEffect(() => {
    if (isLoading && streamingMessageId && messagesEndRef.current) {
      // Smooth scroll when streaming starts
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isLoading, streamingMessageId]);

  // Auto-scroll during content updates for streaming message
  useEffect(() => {
    if (streamingMessageId && messagesEndRef.current) {
      // Find the streaming message and scroll to it smoothly
      const streamingMessage = messages.find(m => m.id === streamingMessageId);
      if (streamingMessage && streamingMessage.content) {
        // Use a slight delay to ensure the content has rendered
        const timeoutId = setTimeout(() => {
          if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }, 50);
        
        return () => clearTimeout(timeoutId);
      }
    }
  }, [messages, streamingMessageId]);

  // Sort messages by timestamp to ensure proper chronological ordering
  const sortedMessages = [...messages].sort((a, b) => a.timestamp - b.timestamp);

  // Show conversation loading state when switching conversations
  if (isLoadingConversation) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="relative w-8 h-8">
          {/* Spinning gradient icon */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#8b5cf6] via-[#7c3aed] to-[#8b5cf6] rounded-full animate-spin animate-pulse" 
               style={{ animationDuration: '1.5s' }}>
          </div>
          
          {/* Inner icon */}
          <div className="absolute inset-1 bg-[#1a1a1a] rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-[#8b5cf6] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#2d2d2d] to-[#1a1a1a] rounded-full flex items-center justify-center border border-[#3f3f46]">
            <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Start the conversation</h3>
          <p className="text-zinc-400">Send a message to begin chatting with AI</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide"
    >
      <div className="max-w-4xl mx-auto">
        {/* Messages */}
        {sortedMessages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isStreaming={streamingMessageId === message.id}
          />
        ))}



        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
} 