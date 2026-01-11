import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class ProductDetail extends Document {
    @Prop({ type: Types.ObjectId, ref: 'Product', required: true, unique: true })
    productId: Types.ObjectId;

    @Prop()
    description?: string;

    @Prop({ type: Object })
    specs?: Record<string, any>;

    @Prop()
    ratingsAvg?: number;

    @Prop({ default: 0 })
    reviewsCount: number;

    @Prop({ type: [String] })
    relatedIds: string[]; // Array of sourceIds
}

export const ProductDetailSchema = SchemaFactory.createForClass(ProductDetail);
