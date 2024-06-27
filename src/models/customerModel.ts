import { model, Schema, Document } from "mongoose";

interface CustomerDoc extends Document {
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  salt: string;
  verfied:boolean;
  otp:number;
  otp_expiry:Date;
  lat:number;
  lng:number;

}

const customerShema = new Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    address: { type: String },
    phone: { type: String , required:true},
    email: { type: String , required:true},
    password: { type: String , required:true},
    salt: { type: String , required:true},
    verfied: { type: Boolean },
    otp: { type: Number },
    otp_expiry: { type: Date },
    lat: { type: Number },
    lng: { type: Number },

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

const customerModel = model<CustomerDoc>("customer", customerShema);
export { customerModel };
