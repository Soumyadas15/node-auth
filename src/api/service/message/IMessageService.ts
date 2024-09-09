import { Message } from "@prisma/client";

export interface IMessageService {
    getMessageById(messageId: string): Promise<Message | null>;
    getConversation(senderId: string, recipientId: string, before: Date, count: number, sort: 'asc' | 'desc'): Promise<Message[] | null>;
    createMessage(recipientId: string, content: string, senderId: string): Promise<Message>;
    editMessage(messageId: string, content: string): Promise<Message>;
    deleteMessage(messageId: string): Promise<void>;
}