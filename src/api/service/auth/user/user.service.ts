import {  User } from "@prisma/client";


import { validateRegister } from "../../../validator/register.validator";
import { PasswordService } from "../password/password.service";
import { IUserRepository } from "./IUserRepository";
import { AppError } from "../../../error/app.error";
import { ILoginResponse } from "./ILoginResponse";


export class UserService {
    constructor(
        private userRepository: IUserRepository,
        private passwordService: PasswordService,
    ) {}

    async createUser(userData: any): Promise<User> {
        const validatedUser = validateRegister(userData);
        const { name, email, password } = validatedUser;

        const existingUser = await this.userRepository.findByEmail(email);

        if (existingUser) {
            throw new AppError("Email already in use", 409);
        }

        const hashedPassword = await this.passwordService.hash(password);

        const user = await prisma.user.create({
            data: {
                name: name,
                password: hashedPassword,
                email: email,
                provider: 'credentials'
            }
        })
        
        return user;
    }

    async getUserByEmail(email: string): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            }
        })
        
        return user;
    }

    async getUserById(id: string): Promise<User> {
        const user = await prisma.user.findUnique({
            where: {
                id: id,
            }
        })
        
        return user;
    }

    async userCredentialsLogin(email: string, password: string): Promise<ILoginResponse | void>{
        const user = await this.userRepository.credentialsLogin(email, password);
        return user
    }
}