import { RequestLog } from "@prisma/client";
import { ILogInterface } from "./ILogInterface";
import { prisma } from "../../../utils/prisma.util";
import { UserRepository } from "../auth/user/user.repository";


export class LogService implements ILogInterface{
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }
    async createLog(ip: string, requestBody: object, time: Date, userId: string | null): Promise<RequestLog> {
        const body = JSON.stringify(requestBody);
        let user = null;
        if(userId != null) {
            user = await this.userRepository.findById(userId);
        }
        
        const log = await prisma.requestLog.create({
            data: {
                ip: ip,
                body: body,
                timeOfCall: time,
                username: user ? user.name : '',
            }
        })
        return log;
    }
    async fetchLogs(startTime?: Date, endTime?: Date): Promise<RequestLog[]> {
        let end = endTime ? endTime : new Date();
        let start = startTime ? startTime :  new Date(end.getTime() - 5 * 60 * 1000);

        if (start > end) {
            throw new Error('Start time cannot be later than end time');
        }
        console.log(start)
        console.log(end)

        const logs = await prisma.requestLog.findMany({
            where: {
                timeOfCall: {
                    gte: start,
                    lte: end,
                },
            },
            orderBy: {
                timeOfCall: 'desc',
            },
        });
        return logs;
    }

}