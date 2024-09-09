import { Request, Response } from 'express';
import { validateLogin } from '../../validator/login.validator';
import { UserService } from '../../service/auth/user/user.service';
import { UserRepository } from '../../service/auth/user/user.repository';
import { PasswordService } from '../../service/auth/password/password.service';
import { AuthError } from '../../error/auth.error';
import { ResponseFormatter } from '../../../utils/response.util';

const passwordService = new PasswordService();
const userRepository = new UserRepository();
const userService = new UserService(userRepository, passwordService);

export const loginUser = async (req: Request, res: Response) => {
    try {
        const validatedFields = validateLogin(req.body);
        const { email, password } = validatedFields;

        const existingUser = await userService.getUserByEmail(email);
        if (!existingUser) {
            return ResponseFormatter.error(res, 404, "User does not exist");
        }

        if (existingUser.provider !== 'credentials') {
            return ResponseFormatter.error(res, 409, "Email already in use with another provider");
        }

        const passwordMatch = await passwordService.verify(existingUser.password, password);
        if (!passwordMatch) {
            return ResponseFormatter.error(res, 401, "Incorrect credentials");
        }

        try {
            const user = await userService.userCredentialsLogin(email, password);
            if (!user) {
                return ResponseFormatter.error(res, 401, "Incorrect credentials");
            }

            const responseData = {
                token: user.token,
                profile: {
                    name: user.user.name,
                    email: user.user.email,
                }
            };

            return ResponseFormatter.success(res, "Login successful", responseData);

        } catch (error) {
            if (error instanceof AuthError) {
                switch (error.type) {
                    case "CredentialsSignin":
                        return ResponseFormatter.error(res, 401, "Incorrect credentials");
                    default:
                        return ResponseFormatter.error(res, 500, "Something went wrong");
                }
            }
            throw error;
        }

    } catch (err) {
        return ResponseFormatter.error(res, 400, err.message || "Validation error");
    }
};