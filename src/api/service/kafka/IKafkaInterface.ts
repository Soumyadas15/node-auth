import { RequestLog } from "@prisma/client";

export interface IKafkaInterface {
    connectProducer(): Promise<void>;
    produceLog(log: Omit<RequestLog, 'id'>): Promise<boolean>;
    startLogConsumer(): Promise<void>;
}