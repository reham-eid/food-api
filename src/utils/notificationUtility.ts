import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config({ path: "../config/.env" });

// OTP
export const GenerateOtp = () => {
  const otp = Math.floor(Math.random() * 900000);
  let expiry = new Date();
  expiry.setTime(new Date().getTime() + 30 * 60 * 1000); // 30 min
  return { otp, expiry };
};

export const onRequestOtp = async(otp:number , toPhone:string)=>{
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  
  const client = twilio(accountSid, authToken);
  
    const message = await client.messages.create({
      body :`You OTP is ${otp}`,
      to : toPhone,
      from:process.env.RECEIVE_SMS_TO ,
    });
    console.log(message);
    return message
  };


