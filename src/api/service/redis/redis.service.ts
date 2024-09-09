import Redis from 'ioredis';
import dotenv from 'dotenv';
import { IRedisInterface } from './IRedisInterface';
import { Message } from '@prisma/client';

dotenv.config();

export class RedisService implements IRedisInterface {
    private client: Redis;
    private pubClient: Redis;
    private subClient: Redis;

    constructor() {
        const redisConfig = {
            host: process.env.REDIS_HOST || '127.0.0.1',
            port: Number(process.env.REDIS_PORT) || 6379,
            password: process.env.REDIS_PASSWORD,
            retryStrategy: (times: number) => {
                return Math.min(times * 50, 2000);
            }
        };

        this.client = new Redis(redisConfig);
        this.pubClient = new Redis(redisConfig);
        this.subClient = new Redis(redisConfig);

        this.setupErrorHandlers(this.client, 'Main');
        this.setupErrorHandlers(this.pubClient, 'Publisher');
        this.setupErrorHandlers(this.subClient, 'Subscriber');
    }

    private setupErrorHandlers(client: Redis, clientName: string): void {
        client.on('error', (error) => {
            console.error(`Redis ${clientName} connection error:`, error);
        });

        client.on('connect', () => {
            console.log(`Connected to Redis (${clientName})`);
        });
    }

    public async publish(channel: string, message: string): Promise<void> {
        try {
            await this.pubClient.publish(channel, JSON.stringify(message));
        } catch (error) {
            console.error('Error publishing message:', error);
            throw new Error('Failed to publish message');
        }
    }

    public async subscribe(channel: string, callback: (channel: string, message: string) => void): Promise<void> {
        try {
            await this.subClient.subscribe(channel);
            console.log(`Subscribed to ${channel}`);

            this.subClient.on('message', (subscribedChannel: string, message: string) => {
                if (subscribedChannel === channel) {
                    try {
                        callback(subscribedChannel, message);
                    } catch (error) {
                        console.error('Error parsing message:', error);
                    }
                }
            });
        } catch (error) {
            console.error(`Failed to subscribe to ${channel}:`, error);
            throw new Error(`Failed to subscribe to ${channel}`);
        }
    }

    public async on(channel: string, callback: (channel: string, message: string) => void): Promise<void> {
        this.subClient.on('message', (subscribedChannel: string, message: string) => {
            if (subscribedChannel === channel) {
                try {
                    // const parsedMessage: Message = JSON.parse(message);
                    callback(subscribedChannel, message);
                } catch (error) {
                    console.error('Error parsing message:', error);
                }
            }
        });
    }

    public async disconnect(): Promise<void> {
        try {
            await Promise.all([
                this.client.quit(),
                this.pubClient.quit(),
                this.subClient.quit()
            ]);
            console.log('All Redis clients disconnected');
        } catch (error) {
            console.error('Error disconnecting Redis clients:', error);
            throw new Error('Failed to disconnect Redis clients');
        }
    }
}