import { Server, Socket } from "socket.io";

export interface ISocketInterface {
  initListeners(): Promise<void>;
  stop(): Promise<void>;
  readonly io: Server;
}

export interface DecodedToken {
  userId: string;
}

interface ChatMessage {
  content: string;
  senderId: string;
  recipientId: string;
}