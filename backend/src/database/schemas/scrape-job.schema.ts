import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum JobStatus {
    PENDING = 'PENDING',
    RUNNING = 'RUNNING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
}

@Schema({ timestamps: true })
export class ScrapeJob extends Document {
    @Prop({ required: true })
    targetUrl: string;

    @Prop({ required: true })
    targetType: string; // NAVIGATION, CATEGORY, PRODUCT

    @Prop({ type: String, enum: JobStatus, default: JobStatus.PENDING })
    status: JobStatus;

    @Prop()
    startedAt?: Date;

    @Prop()
    finishedAt?: Date;

    @Prop()
    errorLog?: string;
}

export const ScrapeJobSchema = SchemaFactory.createForClass(ScrapeJob);
