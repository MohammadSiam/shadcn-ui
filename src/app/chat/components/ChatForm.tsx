"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendIcon } from "lucide-react";

interface ChatFormProps {
  onSendMessage: (message: string) => void;
  isConnected: boolean;
}

export default function ChatForm({
  onSendMessage,
  isConnected,
}: ChatFormProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && isConnected) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        disabled={!isConnected}
        className="flex-1"
      />
      <Button
        type="submit"
        disabled={!isConnected || !message.trim()}
        size="icon"
      >
        <SendIcon className="h-4 w-4" />
      </Button>
    </form>
  );
}
