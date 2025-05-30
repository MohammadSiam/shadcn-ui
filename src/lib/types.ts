// Message types
export interface ChatMessage {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
  room: string;
}

// Room user event types
export interface UserJoinedEvent {
  username: string;
  timestamp: Date;
  users: string[];
}

export interface UserLeftEvent {
  username: string;
  timestamp: Date;
  users: string[];
}