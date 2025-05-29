import { createServer } from "node:http";
import { Server } from "socket.io";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3001", 10);

// Create HTTP server
const server = createServer();

// Create Socket.io server
const io = new Server(server, {
  cors: {
    origin: "*", // In production, set this to your frontend URL
    methods: ["GET", "POST"],
  },
});

// Define message type
type Message = {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
  room: string;
};

// Track users in rooms
const roomUsers: Record<string, string[]> = {};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  let currentRoom = "";
  let currentUsername = "";

  // Handle joining a room
  socket.on("join-room", (room, username) => {
    // Leave previous room if any
    if (currentRoom) {
      socket.leave(currentRoom);
      if (roomUsers[currentRoom]) {
        roomUsers[currentRoom] = roomUsers[currentRoom].filter(
          (user) => user !== currentUsername
        );
      }
    }

    // Join new room
    socket.join(room);
    currentRoom = room;
    currentUsername = username;

    // Add user to room
    if (!roomUsers[room]) {
      roomUsers[room] = [];
    }
    roomUsers[room].push(username);

    console.log(`User ${username} (${socket.id}) joined room: ${room}`);

    // Notify room about new user
    io.to(room).emit("user_joined", {
      username,
      timestamp: new Date(),
      users: roomUsers[room],
    });

    // Send welcome message to the user
    socket.emit("message", {
      id: `system-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: `Welcome to the room "${room}", ${username}!`,
      sender: "System",
      timestamp: new Date(),
      room,
    });

    // Notify others in the room
    socket.to(room).emit("message", {
      id: `system-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: `${username} has joined the room.`,
      sender: "System",
      timestamp: new Date(),
      room,
    });
  });

  // Handle leaving a room
  socket.on("leave-room", (room) => {
    socket.leave(room);
    if (roomUsers[room]) {
      roomUsers[room] = roomUsers[room].filter(
        (user) => user !== currentUsername
      );
    }

    // Notify room that user left
    io.to(room).emit("user-left", {
      username: currentUsername,
      timestamp: new Date(),
      users: roomUsers[room] || [],
    });

    console.log(`User ${currentUsername} (${socket.id}) left room: ${room}`);
    currentRoom = "";
  });

  // Handle messages
  socket.on("message", (message: Message) => {
    console.log("Message received:", message);

    // Ensure message has a unique ID
    const messageToSend = {
      ...message,
      id:
        message.id ||
        `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    // Send message to the specific room
    io.to(message.room).emit("message", messageToSend);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    // Remove user from current room
    if (currentRoom && roomUsers[currentRoom]) {
      roomUsers[currentRoom] = roomUsers[currentRoom].filter(
        (user) => user !== currentUsername
      );

      // Notify room that user left
      io.to(currentRoom).emit("user-left", {
        username: currentUsername,
        timestamp: new Date(),
        users: roomUsers[currentRoom],
      });

      // Notify room with system message
      io.to(currentRoom).emit("message", {
        id: `system-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: `${currentUsername} has left the room.`,
        sender: "System",
        timestamp: new Date(),
        room: currentRoom,
      });
    }
  });
});

server.listen(port, hostname, () => {
  console.log(`> Socket.io server ready on http://${hostname}:${port}`);
});
