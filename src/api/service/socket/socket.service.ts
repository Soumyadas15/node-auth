import { Server } from "socket.io";
import { RedisService } from '../redis/redis.service';
import { Message } from "@prisma/client";

export class SocketService {
    private _io: Server;
    private redisService: RedisService;

    constructor(){
        console.log("Socket service started")
        this._io = new Server({
            cors: {
                allowedHeaders: ['*'],
                origin: '*',
            }
        });
        this.redisService = new RedisService();
        this.initPubSub();
    }

    private async initPubSub() {
        await this.redisService.subscribe('MESSAGE', (channel: string, message: string) => {
            this._io.emit('event:message', JSON.parse(JSON.stringify(message)));
        });
    }
    private async messageSubscribe() {
        
    }
    

    public async initListeners() {
        const io = this._io;
        io.on('connection', (socket) => {
            console.log(`New socket connected ${socket.id}`);
            socket.on('event:message', async ({ message }: { message: string }) => {
                console.log(message)
                // await this.redisService.publish('MESSAGE', message);
            });
        });
    }

    get io(){
        return this._io;
    }

    public async stop() {
        await this.redisService.disconnect();
    }
}