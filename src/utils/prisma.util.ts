import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

declare global {
    var prisma: PrismaClient | undefined;
}

const createPrismaClient = (): PrismaClient => {
    return new PrismaClient({
        log: ['query', 'info', 'warn', 'error'],
    });
};

export const prisma = global.prisma || createPrismaClient();

if (!global.prisma) {
    global.prisma = prisma;
}

process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit();
});

process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    process.exit();
});