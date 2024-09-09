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

export const sendMessage = async (req: Request, res: Response) => {
    try {
        const { recipientId, content } = req.body;
        const userId = res.locals.userId;
        
        const existingSender = await userService.getUserById(userId);
        if (!existingSender) {
            return ResponseFormatter.error(res, 404, "Sender not found");
        }


        const existingReceiver = await userService.getUserById(recipientId);
        if (!existingReceiver) {
            return ResponseFormatter.error(res, 404, "Recipient not found");
        }

        const message = await messageService.createMessage(recipientId, content, userId);

        const response = {
            messageId: message.id,
            senderId: message.senderId,
            receiverId: message.recipientId,
            content: message.content,
            timestamp: message.createdAt,
        }

        return ResponseFormatter.success(res, "Message sent successfully", response);

    } catch (err) {
        if (err instanceof AppError) {
            return ResponseFormatter.error(res, err.statusCode, err.message);
        }
        return ResponseFormatter.error(res, 500, "An unexpected error occurred");
    }
};