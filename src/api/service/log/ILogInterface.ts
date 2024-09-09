import { RequestLog } from "@prisma/client";

export interface ILogInterface {
  createLog(ip: string, requestBody: object, time: Date, userId: string | null): Promise<RequestLog>;
  fetchLogs(startTime?: Date, endTime?: Date): Promise<RequestLog[]>;
}