import { Server } from "socket.io";
import { RedisService } from '../redis/redis.service';
import { Message } from "@prisma/client";
import { KafkaService } from "../kafka/kafka.service";

export class SocketService {
    private _io: Server;
    private redisService: RedisService;
    private kafkaService: KafkaService;

    constructor(){
        console.log("Socket service started")
        this._io = new Server({
            cors: {
                allowedHeaders: ['*'],
                origin: '*',
            }
        });
        this.redisService = new RedisService();
        this.kafkaService = new KafkaService();
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
    
            socket.on('joinRoom', ({ roomId }) => {
                socket.join(roomId);
                console.log(`Socket ${socket.id} joined room ${roomId}`);
            });

            socket.on('event:typing', ({ roomId, senderId, typing }) => {
                console.log('User is typing');
                socket.to(roomId).emit('event:typing', { senderId, typing });
            });
    
            socket.on('event:message', async ({ message }: { message: { senderId: string; recipientId: string; body: string } }) => {
                console.log(message);
                const { senderId, recipientId, body } = message;

                const roomId = this.getRoomId(senderId, recipientId);
    
                io.to(roomId).emit('event:message', { senderId, recipientId, body });
                //@ts-ignore
                await this.kafkaService.produceMessage(message);
            });
    
            // Clean up on disconnect
            socket.on('disconnect', () => {
                console.log(`Socket disconnected ${socket.id}`);
            });
        });
    }

    public getRoomId(user1Id: string, user2Id: string): string {
        // Ensure the room ID is consistent and unique for the pair of users
        return [user1Id, user2Id].sort().join('-');
    }

    get io(){
        return this._io;
    }

    public async stop() {
        await this.redisService.disconnect();
    }
}