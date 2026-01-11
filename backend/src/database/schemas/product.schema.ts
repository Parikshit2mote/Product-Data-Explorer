import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Product extends Document {
    @Prop({ required: true, unique: true, index: true })
    sourceId: string;

    @Prop({ required: true })
    title: string;

    @Prop()
    price?: number;

    @Prop({ default: 'GBP' })
    currency: string;

    @Prop()
    imageUrl?: string;

    @Prop({ required: true, unique: true })
    sourceUrl: string;

    @Prop({ index: true })
    lastScrapedAt?: Date;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Category' }] })
    categoryIds: Types.ObjectId[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.virtual('detail', {
    ref: 'ProductDetail',
    localField: '_id',
    foreignField: 'productId',
    justOne: true
});

ProductSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'productId'
});
