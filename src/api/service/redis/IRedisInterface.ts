import { Message } from "@prisma/client";

export interface IRedisInterface {
    publish(channel: string, message: string): Promise<void>;
    subscribe(channel: string, callback: (channel: string, message: string) => void): Promise<void>;
    on(channel: string, callback: (channel: string, message: string) => void): Promise<void>;
    disconnect(): Promise<void>;
}