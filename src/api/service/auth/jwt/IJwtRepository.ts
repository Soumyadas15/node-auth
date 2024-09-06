export interface IJwtRepository {
    generateToken(userId: string): string;
    verifyToken(token: string): Promise<any>;
}