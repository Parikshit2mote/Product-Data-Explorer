import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Category extends Document {
    @Prop({ type: Types.ObjectId, ref: 'Navigation', required: true })
    navigationId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Category', default: null })
    parentId?: Types.ObjectId;

    @Prop({ required: true })
    title: string;

    @Prop({ required: true, unique: true })
    slug: string;

    @Prop({ default: 0 })
    productCount: number;

    @Prop()
    lastScrapedAt?: Date;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Product' }] })
    productIds: Types.ObjectId[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);

// Virtuals for subcategories if needed
CategorySchema.virtual('subCategories', {
    ref: 'Category',
    localField: '_id',
    foreignField: 'parentId'
});
