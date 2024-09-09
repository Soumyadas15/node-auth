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

export const editMessage = async (req: Request, res: Response) => {
    try {
        const { messageId } = req.params;
        const { content } = req.body;
        const userId = res.locals.userId;

        const user = await userService.getUserById(userId);
        if(!user){
            return ResponseFormatter.error(res, 404, "User not found");
        }

        if (!content || typeof content !== 'string') {
            return ResponseFormatter.error(res, 400, "Invalid message content");
        }

        const message = await messageService.getMessageById(messageId);
        if (!message) {
            return ResponseFormatter.error(res, 404, "Message not found");
        }

        if (message.senderId !== userId) {
            return ResponseFormatter.error(res, 401, "Unauthorized");
        }

        const updatedMessage = await messageService.editMessage(messageId, content);

        return ResponseFormatter.success(res, "Message edited successfully");

    } catch (err) {
        if (err instanceof AppError) {
            return ResponseFormatter.error(res, err.statusCode, err.message);
        }
        return ResponseFormatter.error(res, 500, "An unexpected error occurred");
    }
};