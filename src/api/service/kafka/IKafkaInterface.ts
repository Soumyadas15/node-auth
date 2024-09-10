import { Message, RequestLog } from "@prisma/client";

export interface IKafkaInterface {
    connectProducer(): Promise<void>;
    produceLog(log: Omit<RequestLog, 'id'>): Promise<boolean>;
    startLogConsumer(): Promise<void>;
    produceMessage(message: Omit<Message, 'id' | 'createdAt' | 'updatedAt' | 'isEdited'>): Promise<boolean>;
    startMessageConsumer(): Promise<void>;
}