import { model, Schema, Document } from "mongoose";

interface DeliveryDoc extends Document {
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  salt: string;
  lat: number;
  lng: number;
  pinCode: string;
  verified:boolean,
  isAvaliable:boolean
}

const deliveryShema = new Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    address: { type: String },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    verified: { type: Boolean ,required: true},
    isAvaliable: { type: Boolean },
    lat: { type: Number },
    lng: { type: Number },
    pinCode: { type: String },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.salt;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

const deliveryModel = model<DeliveryDoc>("delivery", deliveryShema);
export { deliveryModel };
