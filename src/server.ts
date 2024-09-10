import http, { Server as HttpServer } from 'http';
import dotenv from 'dotenv';
import app from './index';
import { SocketService } from './api/service/socket/socket.service';
import { KafkaService } from './api/service/kafka/kafka.service';

dotenv.config();

export class Server {
    private app: typeof app;
    private server: HttpServer;
    private socketService: SocketService;
    private kafkaService: KafkaService;
    private port: string | number;

    constructor() {
        this.app = app;
        this.port = process.env.PORT || 3000;
        this.server = http.createServer(this.app);
        this.socketService = new SocketService();
        this.kafkaService = new KafkaService();
    }

    private initializeSocketService(): void {
        this.socketService.io.attach(this.server);
        this.socketService.initListeners();
    }

    private async initializeKafkaService(): Promise<void> {
        try {
            await this.kafkaService.connectProducer();
            await this.kafkaService.startLogConsumer();
            await this.kafkaService.startMessageConsumer();
        } catch (error) {
            console.error('Error while initializing Kafka services');
            process.exit(1);
        }
    }

    public async start(): Promise<void> {
        await this.initializeKafkaService();
        this.server.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });

        this.initializeSocketService();
        this.handleShutdown();
    }

    private handleShutdown(): void {
        process.on('SIGINT', () => {
            console.log('Shutting down the server...');
            this.server.close(async () => {
                console.log('HTTP Server shut down successfully.');
                await this.kafkaService.disconnectProducer();
                console.log('Kafka Producer disconnected.');

                process.exit(0);
            });
        });
    }
}
const server = new Server();
server.start();