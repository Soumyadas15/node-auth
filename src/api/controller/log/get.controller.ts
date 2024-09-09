import { Request, Response } from 'express';
import { UserRepository } from '../../service/auth/user/user.repository';
import { PasswordService } from '../../service/auth/password/password.service';
import { UserService } from '../../service/auth/user/user.service';
import { AppError } from '../../error/app.error';
import { ResponseFormatter } from '../../../utils/response.util';
import { LogService } from '../../service/log/log.service';

const passwordService = new PasswordService();
const userRepository = new UserRepository();
const userService = new UserService(userRepository, passwordService);
const logService = new LogService();

export const getLogs = async (req: Request, res: Response) => {
    try {
        const { endTime, startTime } = req.query;
        const userId = res.locals.userId;


        const endTimeDate = endTime ? new Date(endTime as string) : new Date();
        const startTimeDate = startTime ? new Date(startTime as string) : new Date();

        const user = await userService.getUserById(userId);
        if (!user) {
            return ResponseFormatter.error(res, 404, "User not found");
        }

        const logs = await logService.fetchLogs();

        return ResponseFormatter.success(res, "Logs fetched", { logs });

    } catch (err) {
        if (err instanceof AppError) {
            return ResponseFormatter.error(res, err.statusCode, err.message);
        }
        return ResponseFormatter.error(res, 500, "An unexpected error occurred");
    }
};