import { Schema, model, Document, Types } from "mongoose";

export interface foodDoc extends Document {
  vendorId: string;
  name: string;
  description: string;
  category: string;
  foodType: string;
  readyTime: number;
  price: number;
  rating: string;
  images: [string];
}
const foodShema = new Schema(
  {
    vendorId: {
      type: Types.ObjectId,
      ref: "vendor",
    },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String },
    foodType: { type: String, required: true },
    readyTime: { type: Number },
    price: { type: Number, required: true },
    rating: { type: String },
    images: { type: [String] },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

const foodModel = model<foodDoc>("food", foodShema);
export { foodModel };
