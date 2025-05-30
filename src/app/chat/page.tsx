"use client";
import { useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import ChatForm from "./components/ChatForm";
import ChatMessages from "./components/ChatMessages";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initializeSocket, joinRoom, sendMessage } from "@/lib/socketClient";

// Define message type
type ChatMessage = {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
  room: string;
};

export default function ChatPage() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [roomUsers, setRoomUsers] = useState<string[]>([]);

  // Initialize socket connection
  useEffect(() => {
    const socketInstance = initializeSocket();

    socketInstance.on("connect", () => {
      setIsConnected(true);
      console.log("Connected to socket server");
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
      setIsJoined(false);
      console.log("Disconnected from socket server");
    });

    socketInstance.on("message", (message: ChatMessage) => {
      if (message.room === room) {
        setMessages((prev) => [...prev, message]);
      }
    });

    socketInstance.on(
      "user_joined",
      (data: { username: string; users: string[] }) => {
        setRoomUsers(data.users);
      }
    );

    socketInstance.on(
      "user-left",
      (data: { username: string; users: string[] }) => {
        setRoomUsers(data.users);
      }
    );

    setSocket(socketInstance);

    return () => {
      // No need to disconnect here as we're using a singleton
    };
  }, [room]);

  // Join room handler
  const handleJoinRoom = () => {
    if (username.trim() && room.trim() && isConnected) {
      joinRoom(room, username);
      setIsJoined(true);
      setMessages([]); // Clear messages when joining a new room
    }
  };

  // Send message handler
  const handleSendMessage = (text: string) => {
    if (socket && text.trim() && username && room && isJoined) {
      const newMessage: Omit<ChatMessage, "room"> = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text,
        sender: username,
        timestamp: new Date(),
      };

      sendMessage(room, newMessage);
    }
  };

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Real-time Chat</span>
            <span className="text-sm font-normal">
              {isConnected ? (
                <span className="text-green-500">● Connected</span>
              ) : (
                <span className="text-red-500">● Disconnected</span>
              )}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isJoined ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  disabled={!isConnected}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="room">Room</Label>
                <Input
                  id="room"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder="Enter room name"
                  disabled={!isConnected}
                />
              </div>
              <Button
                onClick={handleJoinRoom}
                disabled={!isConnected || !username.trim() || !room.trim()}
                className="w-full"
              >
                Join Room
              </Button>
            </div>
          ) : (
            <div className="flex flex-col h-[600px]">
              <div className="mb-2 text-sm p-2 bg-muted/20 rounded-md">
                <span className="font-medium">Room:</span> {room} |
                <span className="font-medium ml-2">Users:</span>{" "}
                {roomUsers.join(", ")}
              </div>
              <div className="flex-1 flex flex-col overflow-hidden">
                <ChatMessages messages={messages} currentUser={username} />
                <ChatForm
                  onSendMessage={handleSendMessage}
                  isConnected={isConnected}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
