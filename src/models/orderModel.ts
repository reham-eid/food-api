import { Schema, model, Document, Types } from "mongoose";

export interface orderDoc extends Document {
  orderId: string;
  vendorId: string;
  items: [any]; // [ {food , quantity:1} ]
  totalAmuont: number;
  paidAmuont: number;
  orderDate: Date;
  // paidType: string; // {COD , CARD , Net Banking , Wallet }
  // paymentResponse: string; // { status : true , response: Bank response}
  orderStatus: string; // current status{Accept,Reject,Under-process,Ready} like this {waiting , preparing, onway , delivered , cancelled}
  remarks: string;
  deliveryId: string;
  readyTime: number; // max 60min cause it is food order
}
const orderShema = new Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    vendorId: {
      type: Types.ObjectId,
      ref: "vendor",
      required: true,
    },
    items: [
      {
        food: { type: Types.ObjectId, ref: "food", required: true },
        quantity: { type: Number, required: true },
      },
    ],
    totalAmuont: { type: Number, required: true },
    paidAmuont: { type: Number, required: true },

    orderDate: { type: Date, required: true },
    orderStatus: { type: String },
    remarks: { type: String },
    deliveryId: { type: String },
    // appliedOffers: { type: Boolean },
    // offerId: { type: String },
    readyTime: { type: Number , default:0 },
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

const orderModel = model<orderDoc>("order", orderShema);
export { orderModel };
