import { Conversation } from "@prisma/client";

export interface IConversationInterface{
    getConversationById(id: string): Promise<Conversation | null>
    getConversationBySenderAndRecipientId(senderId: string, receiverId: string): Promise<Conversation | null>;
    createConversation(senderId: string, receiverId: string): Promise<Conversation>;
}