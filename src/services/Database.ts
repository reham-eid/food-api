import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "../config/.env" });

export default async () => {
  try {
    await mongoose.connect(process.env.DB_HOST_URL).then((result) => {
      console.log(`connect to DB `);
    });
  } catch (err) {
    console.log(`error from DB connecion is ${err}`);
  }
};
