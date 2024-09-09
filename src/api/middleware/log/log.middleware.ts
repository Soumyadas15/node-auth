import { Request, Response, NextFunction } from 'express';
import { LogService } from '../../service/log/log.service';
import { JwtService } from '../../service/auth/jwt/jwt.service';
import { KafkaService } from '../../service/kafka/kafka.service';
import { RequestLog } from '@prisma/client';

const logService = new LogService();
const jwtService = new JwtService();
const kafkaService = new KafkaService();

export const logMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '';
    const requestBody = req.body;
    const time = new Date();

    let userId: string | null = null;

    const authHeader = req.headers['authorization'];
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        try {
            const verificationResponse = await jwtService.verifyToken(token);
            userId = verificationResponse.id;
        } catch (error) {
            console.error('Token verification failed:', error);
        }
    }

    const log: Omit<RequestLog, 'id'> = {
        ip: ip as string,
        body: requestBody,
        timeOfCall: time,
        username: userId || undefined,
    };
    
    if(requestBody){
        await kafkaService.produceLog(log)
    }

    next();
};