import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";
import config from "config";

const stripSecretKey = config.get("STRIPE_SECRET_KEY") as string;
const stripe = new Stripe(stripSecretKey);

interface stripeArgs {
  email: string;
  token: any;
  amount: number;
  offerId: string;
}
export const createStripePayment = async ({
  email,
  token,
  amount,
  offerId,
}: stripeArgs) => {
  const idempotencyKey = uuidv4(); // Generate a unique idempotency key

  try {
    // Create Stripe customer{customer's payment methods & transaction history}
    const customerData = await stripe.customers.create({
      email: email,
      source: token.id,
    });

    // Create charge with idempotency key
    const charge = await stripe.charges.create(
      {
        amount: amount * 100, // Amount in cents
        currency: "EGP",
        customer: customerData.id,
        receipt_email: email, // confirmation payment message
        description: `Payment for order with offer ${offerId}`,
      },
      { idempotencyKey }
    );

    return { status: "SUCCESS", charge };
  } catch (error) {
    return { status: "FAILED", error: error.message };
  }
};
