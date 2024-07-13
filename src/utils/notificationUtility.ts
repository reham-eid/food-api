import twilio from "twilio";
import { config } from "config";

// OTP
export const GenerateOtp = () => {
  const otp = Math.floor(Math.random() * 900000);
  let expiry = new Date();
  expiry.setTime(new Date().getTime() + 30 * 60 * 1000); // 30 min
  return { otp, expiry };
};

export const onRequestOtp = async (otp: number, toPhone: string) => {
  const accountSid = config.get<string>('TWILIO_ACCOUNT_SID') ;
  const authToken =config.get<string>('TWILIO_AUTH_TOKEN');

  const client = twilio(accountSid, authToken);

  const message = await client.messages.create({
    body: `You OTP is ${otp}`,
    to: toPhone,
    from: config.get<string>('RECEIVE_SMS_TO'),
  });
  console.log(message);
  return message;
};
