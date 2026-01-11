import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class Review extends Document {
    @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
    productId: Types.ObjectId;

    @Prop()
    author?: string;

    @Prop()
    rating?: number;

    @Prop()
    text?: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
