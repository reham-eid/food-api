import config  from "config";
import mongoose from "mongoose";

export default async () => {
  try {
    const DB = config.get<string>("DB_LOCAL_URL");
    await mongoose.connect(DB).then(() => {
      console.log(`connect to DB `);
    });
  } catch (err) {
    console.log(`error from DB connecion is ${err}`);
  }
};
