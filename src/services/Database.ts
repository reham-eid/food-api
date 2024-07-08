import mongoose from "mongoose";
import { DB_LOCAL_URL } from '../config/env';

export default async () => {
  try {
    await mongoose.connect(DB_LOCAL_URL).then((result) => {
      console.log(`connect to DB `);
    });
  } catch (err) {
    console.log(`error from DB connecion is ${err}`);
  }
};



