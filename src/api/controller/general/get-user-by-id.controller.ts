import { Request, Response } from 'express';
import { UserRepository } from '../../service/auth/user/user.repository';
import { ResponseFormatter } from '../../../utils/response.util';

const userRepository = new UserRepository();

export const getUserById = async (req: Request, res: Response) => {
    try {
        const userId = res.locals.userId;
        const paramsUserId = req.params.userId;

        if (!userId) return ResponseFormatter.error(res, 401, 'Unauthorized');

        
        const user = await userRepository.findById(paramsUserId);
        if(!user){
            return ResponseFormatter.error(res, 404, "No user found");
        }

        const profile = {
            id: user.id,
            name: user.name,
            email: user.email,
        }

        return ResponseFormatter.success(res, "User fetched successfully", profile);

    } catch (err) {
        return ResponseFormatter.error(res, 500, err.message || "An unexpected error occurred");
    }
};
