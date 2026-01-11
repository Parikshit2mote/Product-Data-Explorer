import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class ViewHistory extends Document {
    @Prop()
    userId?: string;

    @Prop({ required: true })
    sessionId: string;

    @Prop({ type: Object, required: true })
    pathJson: any;
}

export const ViewHistorySchema = SchemaFactory.createForClass(ViewHistory);
