import twilio from "twilio";
import { RECEIVE_SMS_TO, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } from "../config/env";

// OTP
export const GenerateOtp = () => {
  const otp = Math.floor(Math.random() * 900000);
  let expiry = new Date();
  expiry.setTime(new Date().getTime() + 30 * 60 * 1000); // 30 min
  return { otp, expiry };
};

export const onRequestOtp = async(otp:number , toPhone:string)=>{
  const accountSid = TWILIO_ACCOUNT_SID;
  const authToken = TWILIO_AUTH_TOKEN;
  
  const client = twilio(accountSid, authToken);
  
    const message = await client.messages.create({
      body :`You OTP is ${otp}`,
      to : toPhone,
      from:RECEIVE_SMS_TO ,
    });
    console.log(message);
    return message
  };


