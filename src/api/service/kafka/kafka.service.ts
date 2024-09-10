import { Kafka, Producer, Consumer } from "kafkajs";
import { Message, RequestLog } from "@prisma/client";
import fs from 'fs';
import path from 'path';
import { IKafkaInterface } from './IKafkaInterface';
import { LogService } from "../log/log.service";
import dotenv from "dotenv";
import { MessageService } from "../message/message.service";

dotenv.config();

const logService = new LogService();
const messageService = new MessageService();

export class KafkaService implements IKafkaInterface {
    private kafka: Kafka;
    private producer: Producer | null = null;
    private consumer: Consumer | null = null;

    constructor() {
        this.kafka = new Kafka({
            brokers: [process.env.KAFKA_BROKER],
            sasl: {
                username: process.env.KAFKA_USERNAME,
                password: process.env.KAFKA_PASSWORD,
                mechanism: 'plain',
            },
            ssl: {
                ca: [fs.readFileSync(path.resolve('./ca.pem'), "utf-8")],
            },
        });
    }

    public async connectProducer(): Promise<void> {
        if (this.producer) return;
        this.producer = this.kafka.producer();
        await this.producer.connect();
    }



    public async produceLog(log: Omit<RequestLog, 'id'>): Promise<boolean> {
        await this.connectProducer();
        if (!this.producer) {
            throw new Error('Producer is not connected. Call connectProducer first.');
        }
        await this.producer.send({
            topic: 'LOG',
            messages: [{
                key: `log-${Date.now()}`,
                value: JSON.stringify(log),
            }],
        });

        return true;
    }



    public async produceMessage(message: Omit<Message, 'id' | 'createdAt' | 'updatedAt' | 'isEdited'>): Promise<boolean> {
        await this.connectProducer();
        if (!this.producer) {
            throw new Error('Producer is not connected. Call connectProducer first.');
        }
        await this.producer.send({
            topic: 'MESSAGES',
            messages: [{
                key: `message-${Date.now()}`,
                value: JSON.stringify(message),
            }],
        });

        return true;
    }



    public async startLogConsumer(): Promise<void> {
        if (this.consumer) return;
        this.consumer = this.kafka.consumer({
            groupId: 'default',
        });

        await this.consumer.connect();
        await this.consumer.subscribe({ topic: 'LOG' });

        await this.consumer.run({
            autoCommit: true,
            eachMessage: async ({ message, pause }) => {
                if (!message.value) return;

                try {
                    const log = JSON.parse(message.value.toString());
                    const { ip, body, timeOfCall, username } = log;
                    await logService.createLog(ip, body, timeOfCall, username);
                } catch (error) {
                    console.error("Error parsing log message:", error);
                    pause();
                    setTimeout(() => {
                        this.consumer.resume([{
                            topic: "LOG"
                        }])
                    })
                }
            },
        });
    }




    public async startMessageConsumer(): Promise<void> {
        if (this.consumer) return;
        this.consumer = this.kafka.consumer({
            groupId: 'default',
        });

        await this.consumer.connect();
        await this.consumer.subscribe({ topic: 'MESSAGES' });

        await this.consumer.run({
            autoCommit: true,
            eachMessage: async ({ message, pause }) => {
                if (!message.value) return;

                try {
                    const msg = JSON.parse(message.value.toString());
                    console.log('Message', msg)
                    const { recipientId, content, senderId } = msg;
                    await messageService.createMessage(recipientId, content, senderId);
                } catch (error) {
                    console.error("Error parsing log message:", error);
                    pause();
                    setTimeout(() => {
                        this.consumer.resume([{
                            topic: "MESSAGES"
                        }])
                    })
                }
            },
        });
    }

    public async disconnectProducer(): Promise<void> {
        if (this.producer) {
            await this.producer.disconnect();
        }
    }
}