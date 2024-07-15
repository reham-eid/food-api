import { model, Schema, Document } from "mongoose";

interface TransactionDoc extends Document {
  customer: string;
  vendorId: string;
  orderId: string;
  orderTotalPrice: number;
  offerUsed: string;
  status: string;
  paymentMode: string;
  // paymentResponse: string;
}

const transactionSchema = new Schema(
  {
    customer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    vendorId: { type: String, required: false },
    orderId: { type: String, required: false },
    orderTotalPrice: { type: Number, required: true },
    offerUsed: { type: String, default: "NA" },
    status: { type: String, required: true },
    paymentMode: { type: String, required: true },
    // paymentResponse: { type: Schema.Types.Mixed, required: true }, // Use Mixed type to handle any data
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

const transactionModel = model<TransactionDoc>(
  "transaction",
  transactionSchema
);
export { transactionModel };
