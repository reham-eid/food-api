import { Schema, model, Document, Types } from "mongoose";

export interface offerDoc extends Document {
  offerType: string; //{vendor , generic}
  vendors: [any]; // offer is applied only when purchasing from spcefic vendor
  title: string;
  description: string;
  minValue: number; // min total price of order is 300
  offreAmount: number;
  strtValidity: Date;
  endValidity: Date;
  promoCode: string; //WE2023
  promoType: string; //target audience: {USER | ALL | BANK | CARD}
  bank: [any]; // banks associated with the offer
  bins: [any]; //List of BIN (Bank Identification Number) codes associated with the offer
  pinCode: string; //Specific BIN code for the offer
  isActive: boolean;
}
const offerShema = new Schema(
  {
    offerType: { type: String, required: true },
    vendors: [{
      type: Types.ObjectId,
      ref: "vendor",
    }],
    title: { type: String, required: true },
    description: { type: String },
    minValue: { type: Number, required: true },
    offreAmount: { type: Number, required: true },
    strtValidity: { type: Date },
    endValidity: { type: Date },
    promoCode: { type: String, required: true },
    promoType: { type: String, required: true },
    bank: [{ type: String }],
    bins: [{ type: Number }],
    pinCode: { type: String, required: true },
    isActive: { type: Boolean },
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

const offerModel = model<offerDoc>("offer", offerShema);
export { offerModel };
