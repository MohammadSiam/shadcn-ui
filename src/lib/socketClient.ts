"use client";

import { io, Socket } from "socket.io-client";
import { ChatMessage } from "./types";

// Create a singleton socket instance
let socket: Socket | null = null;

export const initializeSocket = () => {
  if (!socket) {
    socket = io("http://localhost:3000");
    console.log("Socket initialized");
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("Socket disconnected");
  }
};

export const joinRoom = (room: string, username: string) => {
  const socket = getSocket();
  if (socket) {
    socket.emit("join-room", room, username);
    console.log(`Joining room: ${room} as ${username}`);
  }
};

export const leaveRoom = (room: string) => {
  const socket = getSocket();
  if (socket) {
    socket.emit("leave-room", room);
    console.log(`Leaving room: ${room}`);
  }
};

export const sendMessage = (
  room: string,
  message: Omit<ChatMessage, "room">
) => {
  const socket = getSocket();
  if (socket) {
    socket.emit("message", { ...message, room });
  }
};
