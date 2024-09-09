import { Request, Response } from 'express';
import { UserRepository } from '../../service/auth/user/user.repository';
import { PasswordService } from '../../service/auth/password/password.service';
import { UserService } from '../../service/auth/user/user.service';
import { AppError } from '../../error/app.error';
import { ResponseFormatter } from '../../../utils/response.util';
import { MessageService } from '../../service/message/message.service';

const passwordService = new PasswordService();
const userRepository = new UserRepository();
const userService = new UserService(userRepository, passwordService);
const messageService = new MessageService();

export const getMessages = async (req: Request, res: Response) => {
    try {
        const { recipientId, before, count, sort } = req.query;
        const userId = res.locals.userId;

        if (!recipientId || typeof recipientId !== 'string') {
            return ResponseFormatter.error(res, 400, "Recipient ID is required and must be a string");
        }

        const beforeDate = before ? new Date(before as string) : new Date();
        const messageCount = count ? parseInt(count as string, 10) : 20;
        const sortOrder = sort === 'desc' ? 'desc' : 'asc';

        const existingSender = await userService.getUserById(userId);
        if (!existingSender) {
            return ResponseFormatter.error(res, 404, "Sender not found");
        }

        const existingReceiver = await userService.getUserById(recipientId as string);
        if (!existingReceiver) {
            return ResponseFormatter.error(res, 404, "Recipient not found");
        }

        const messages = await messageService.getConversation(userId, recipientId as string, beforeDate, messageCount, sortOrder);

        return ResponseFormatter.success(res, "Conversation history retrieved successfully", { messages });

    } catch (err) {
        if (err instanceof AppError) {
            return ResponseFormatter.error(res, err.statusCode, err.message);
        }
        return ResponseFormatter.error(res, 500, "An unexpected error occurred");
    }
};