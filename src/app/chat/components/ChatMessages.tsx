"use client";
import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type Message = {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
  room?: string;
};

interface ChatMessagesProps {
  messages: Message[];
  currentUser: string;
}

export default function ChatMessages({
  messages,
  currentUser,
}: ChatMessagesProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  // Format timestamp
  const formatTime = (date: Date) => {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name.split("_")[0].substring(0, 2).toUpperCase();
  };

  // Check if message is from system
  const isSystemMessage = (sender: string) => sender === "System";

  return (
    <ScrollArea
      ref={scrollAreaRef}
      className="flex-1 p-4 border rounded-md mb-4 overflow-hidden"
      style={{ height: "calc(100% - 80px)" }} // Fixed height with space for input
    >
      <div className="space-y-4 min-h-full">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => {
            const isCurrentUser = message.sender === currentUser;
            const isSystem = isSystemMessage(message.sender);

            if (isSystem) {
              return (
                <div key={message.id} className="flex justify-center">
                  <div className="bg-muted/50 text-muted-foreground text-xs rounded-md px-3 py-1 max-w-[80%] break-words">
                    {message.text}
                  </div>
                </div>
              );
            }

            return (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  isCurrentUser ? "justify-end" : "justify-start"
                }`}
              >
                {!isCurrentUser && (
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback>
                      {getInitials(message.sender)}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`max-w-[70%] ${
                    isCurrentUser
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  } rounded-lg p-3 break-words`}
                >
                  {!isCurrentUser && (
                    <div className="text-xs font-medium mb-1">
                      {message.sender}
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">{message.text}</div>
                  <div className="text-xs opacity-70 mt-1 text-right">
                    {formatTime(message.timestamp)}
                  </div>
                </div>

                {isCurrentUser && (
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback>
                      {getInitials(message.sender)}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            );
          })
        )}
      </div>
    </ScrollArea>
  );
}
