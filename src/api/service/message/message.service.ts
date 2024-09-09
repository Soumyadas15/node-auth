import { Message } from "@prisma/client";
import { IMessageService } from "./IMessageService";
import { prisma } from "../../../utils/prisma.util";
import { ConversationService } from "../conversation/conversation.service";

export class MessageService implements IMessageService {
    private conversationService: ConversationService;

    constructor() {
        this.conversationService = new ConversationService();
    }

    async getMessageById(messageId: string): Promise<Message | null> {
        const message = await prisma.message.findUnique({
            where:{
                id: messageId
            }
        })
        return message;
    }

    async createMessage(recipientId: string, content: string, senderId: string): Promise<Message> {
        let conversation = await this.conversationService.getConversationBySenderAndRecipientId(senderId, recipientId);

        if (!conversation) {
            conversation = await this.conversationService.createConversation(senderId, recipientId);
        }

        const message = await prisma.message.create({
            data: {
                content,
                senderId,
                recipientId,
                conversationId: conversation.id
            }
        });

        return message;
    }

    async editMessage(messageId: string, content: string): Promise<Message> {
        const message = await prisma.message.update({
            where: {
                id: messageId,
            },
            data: {
                content: content
            }
        })

        return message;
    }

    async deleteMessage(messageId: string): Promise<void> {
       await prisma.message.delete({
          where: {
             id: messageId
          }
       })
    }

    async getConversation(
        senderId: string,
        recipientId: string,
        before: Date = new Date(),
        count: number = 20,
        sort: "asc" | "desc" = "asc"
    ): Promise<Message[] | null> {
        const conversation = await this.conversationService.getConversationBySenderAndRecipientId(senderId, recipientId);

        if(!conversation){
            return null;
        }

        const messages = await prisma.message.findMany({
            where: {
                conversationId: conversation.id,
                createdAt: {
                    lt: before
                }
            },
            orderBy: {
                createdAt: sort
            },
            take: count
        });

        return messages;

    }
}