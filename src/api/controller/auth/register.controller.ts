import { Request, Response } from 'express';
import { UserRepository } from '../../service/auth/user/user.repository';
import { PasswordService } from '../../service/auth/password/password.service';
import { UserService } from '../../service/auth/user/user.service';
import { AppError } from '../../error/app.error';
import { ResponseFormatter } from '../../../utils/response.util';

const passwordService = new PasswordService();
const userRepository = new UserRepository();
const userService = new UserService(userRepository, passwordService);

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { email, name, password } = req.body;

        const existingUser = await userService.getUserByEmail(email);
        if (existingUser) {
            return ResponseFormatter.error(res, 409, "Email already in use");
        }

        const user = await userService.createUser({ email, name, password });

        const responseData = {
            userId: user.id,
            name: user.name,
            email: user.email,
        };

        return ResponseFormatter.success(res, "User registered successfully", responseData);

    } catch (err) {
        if (err instanceof AppError) {
            return ResponseFormatter.error(res, err.statusCode, err.message);
        }
        return ResponseFormatter.error(res, 500, "An unexpected error occurred");
    }
};