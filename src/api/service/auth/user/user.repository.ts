import { User } from "@prisma/client";

import { prisma } from "../../../../utils/prisma.util";
import { AuthError } from "../../../error/auth.error";
import { IUserRepository } from "./IUserRepository";
import { ILoginResponse } from "./ILoginResponse";
import { PasswordService } from "../password/password.service";
import { JwtService } from "../jwt/jwt.service";


const passwordService = new PasswordService();
const jwtService = new JwtService()


export class UserRepository implements IUserRepository {
    async create(user: User, password: string): Promise<User> {
        const newUser = await prisma.user.create({
            data: {
                email: user.email,
                name: user.name,
                password: password,
            }
        });

        return newUser;
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await prisma.user.findUnique({ 
            where: { email } 
        });

        return user;
    }

    async findById(id: string): Promise<User> {
        const user = await prisma.user.findUnique({ where: { id } });
        return user;
    }


    async credentialsLogin(email: string, password: string): Promise<ILoginResponse | null> {
        const user = await this.findByEmail(email);
        if (!user) throw new AuthError("CredentialsSignin", "User not found");

        const passwordMatch = await passwordService.verify(user.password, password);
        if (!passwordMatch) throw new AuthError("CredentialsSignin", "Invalid password");
        const token = jwtService.generateToken(user.id);
        const { name, email: userEmail } = user;
        
        return {
            user: {
                name,
                email: userEmail
            },
            token
        };
    }
}