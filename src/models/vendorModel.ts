import { Types, model, Schema, Document } from "mongoose";

interface VendorDoc extends Document {
  name: string;
  ownerName: string;
  foodType: [string];
  pinCode: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  salt: string;
  serviceAvaliable: boolean;
  coverImages: [string];
  rating: number;
  foods: any;
}

const vendorShema = new Schema(
  {
    name: { type: String, required: true },
    ownerName: { type: String, required: true },
    foodType: { type: [String] },
    pinCode: { type: String, required: true },
    address: { type: String },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    serviceAvaliable: { type: Boolean },
    coverImages: { type: [String] },
    rating: { type: Number },
    foods: { type: Types.ObjectId, ref: "food" },
  },
  {
    toJSON: {
      /**
       * sensitive fields or unnecessary fields are excluded
       * It allows you to modify the structure or content of the JSON
       * representation of a Mongoose document before it is serialized
       */
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

const vendorModel = model<VendorDoc>("vendor", vendorShema);
export { vendorModel };
