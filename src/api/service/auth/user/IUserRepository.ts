import { User } from "@prisma/client";
import { ILoginResponse } from "./ILoginResponse";
import { IUserResponse } from "./IUserResponse";

export interface IUserRepository {
    create(user: User, password: string): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    credentialsLogin(email: string, password: string): Promise<ILoginResponse | null>;

    getAllUsers(userId: string): Promise<object[] | null>;
}