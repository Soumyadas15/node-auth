import * as argon2 from "argon2";
import { IPasswordRepository } from "./IPasswordRepository";

export class PasswordService implements IPasswordRepository  {
    async hash(password: string): Promise<string> {
        return await argon2.hash(password);
    }

    async verify(hash: string, password: string): Promise<boolean> {
        return await argon2.verify(hash, password);
    }
}