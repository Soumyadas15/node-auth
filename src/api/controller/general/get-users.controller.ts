import { Request, Response } from 'express';
import { UserRepository } from '../../service/auth/user/user.repository';
import { ResponseFormatter } from '../../../utils/response.util';

const userRepository = new UserRepository();

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const userId = res.locals.userId;
        if (!userId) return ResponseFormatter.error(res, 401, 'Unauthorized');

        
        const users = await userRepository.getAllUsers(userId);
        if(!users){
            return ResponseFormatter.error(res, 404, "No user found");
        }

        return ResponseFormatter.success(res, "Users fetched successfully", users);

    } catch (err) {
        return ResponseFormatter.error(res, 500, err.message || "An unexpected error occurred");
    }
};
