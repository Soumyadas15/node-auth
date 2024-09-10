import { Conversation } from "@prisma/client";
import { IConversationInterface } from "./IConversationInterface";
import { prisma } from "../../../utils/prisma.util";

export class ConversationService implements IConversationInterface {

    async getConversationById(id: string): Promise<Conversation | null> {
        const conversation = await prisma.conversation.findUnique({
            where: {
                id: id,
            }
        });
        return conversation;
    }

    async getConversationBySenderAndRecipientId(senderId: string, receiverId: string): Promise<Conversation | null> {
        const userConversation = await prisma.userConversation.findMany({
            where: {
                userId: senderId || receiverId, 
            }
        });

        const conversation = this.getConversationById(userConversation[0].conversationId);

        return conversation
    }

    async createConversation(senderId: string, receiverId: string): Promise<Conversation> {
        const conversation = await prisma.conversation.create({
            data: {
                name: `Conversation between ${senderId} and ${receiverId}`,
                messages: {
                    create: []
                }
            }
        });

        await prisma.userConversation.createMany({
            data: [
                { userId: senderId, conversationId: conversation.id },
                { userId: receiverId, conversationId: conversation.id }
            ]
        });

        return conversation;
    }
}