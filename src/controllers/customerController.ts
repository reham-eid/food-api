import { Request, Response, NextFunction } from "express";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import {
  cartItem,
  createCustomerInput,
  createOrderInput,
  editCustomerProfileInput,
  loginCustomerInput,
} from "../dto/customer.dto";
import {
  generateSalt,
  generateHashPassword,
  GenerateOtp,
  generateSignature,
  onRequestOtp,
  ValidatePassword,
} from "../utils";
import { customerModel } from "../models/customerModel";
import { foodModel } from "../models/foodModel";
import { orderModel } from "../models/orderModel";
import {
  deliveryModel,
  offerModel,
  transactionModel,
  vendorModel,
} from "../models";
import { createStripePayment } from "../payment-handler/stripe";

const customerSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Convert the request body to an instance of createCustomerInput and validate it
    const customerInputs = plainToClass(createCustomerInput, req.body);
    const inputError = await validate(customerInputs, {
      validationError: { target: true },
    });
    // If there are validation errors, return a 400 status code with the error details
    if (inputError.length > 0) {
      return res
        .status(400)
        .json({ message: `Error in customer SignUp inputs { ${inputError} }` });
    }

    // Destructure phone, email, and password from the validated input data
    const { phone, email, password } = customerInputs;

    // Generate a salt for password hashing
    const salt = await generateSalt();
    // Hash the password using the generated salt
    const hashedPass = await generateHashPassword(password, salt);

    // Generate a one-time password (OTP) and its expiry time
    const { otp, expiry } = GenerateOtp();
    console.log(`OTP >> ${otp} , OTP_expiry >> ${expiry}`);

    const exisitCustomer = await customerModel.findOne({ email });
    if (exisitCustomer !== null) {
      return res
        .status(409)
        .json({ message: " an user exisit with the same email " });
    }
    // Create an object with customer data including default values for firstName and lastName
    const data = {
      firstName: "e",
      lastName: "a",
      address: "",
      phone,
      email,
      password: hashedPass,
      salt,
      verified: false, // Note: This should be 'verified'
      otp,
      otp_expiry: expiry,
      lat: 0,
      lng: 0,
      orders: [],
    };

    // Save the customer data to the database
    const result = await customerModel.create(data);

    // If the operation fails, return a JSON response indicating an error
    if (!result) {
      return res.json({ message: "somthin went wrong in customer signup" });
    }

    // // Send the OTP to the customer's phone number
    // await onRequestOtp(otp, phone);

    // Generate a signature for the customer using their ID, email, and verified status
    const signature = generateSignature({
      _id: result.id,
      email: result.email,
      verified: result.verified, // Note: This should be 'verified'
    });

    // Respond with a JSON object containing a success message, the generated signature,
    // the verification status, and the customer's email
    res.json({
      message: "success",
      signature,
      verified: result.verified, // Note: This should be 'verified'
      email: result.email,
    });
  } catch (error) {
    next(error);
  }
};

const customerLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Convert the request body to an instance of createCustomerInput and validate it
    const customerInputs = plainToClass(loginCustomerInput, req.body);
    const inputError = await validate(customerInputs, {
      validationError: { target: true },
    });

    if (inputError.length > 0) {
      return res
        .status(400)
        .json({ message: `Error in customer Login inputs { ${inputError} }` });
    }

    const { email, password } = customerInputs;

    const exisitCustomer = await customerModel.findOne({ email });
    if (!exisitCustomer) {
      return res
        .status(404)
        .json({ message: "user not found with this email " });
    }

    const comparePass = await ValidatePassword(
      password,
      exisitCustomer.password,
      exisitCustomer.salt
    );
    if (!comparePass) {
      return res
        .status(404)
        .json({ message: "passrod is wrong in customer login" });
    }
    // Generate a signature for the customer using their ID, email, and verified status
    const signature = generateSignature({
      _id: exisitCustomer.id,
      email: exisitCustomer.email,
      verified: exisitCustomer.verified,
    });
    // the verification status, and the customer's email
    res.json({
      message: "success",
      signature,
      verified: exisitCustomer.verified,
      email: exisitCustomer.email,
    });
  } catch (error) {
    next(error);
  }
};

const customerVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { otp } = req.body;
    const customer = req.user;

    const profile = await customerModel.findById(customer?._id);

    // If the operation fails, return a JSON response indicating an error
    if (!profile) {
      return res.json({ message: "somthin went wrong in verify customer" });
    }

    if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
      profile.verified = true;
      await profile.save();

      const signature = generateSignature({
        _id: profile.id,
        email: profile.email,
        verified: profile.verified,
      });

      res.json({
        message: "success",
        signature,
        verified: profile.verified,
        email: profile.email,
      });
    }
  } catch (error) {
    next(error);
  }
};

const requestOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customer = req.user;

    const profile = await customerModel.findById(customer?._id);

    if (!profile) {
      return res.json({
        message: "somthin went wrong in request OTP customer",
      });
    }
    const { otp, expiry } = GenerateOtp();

    profile.otp = otp;
    profile.otp_expiry = expiry;
    await profile.save();

    const sendOtp = onRequestOtp(otp, profile.phone);

    res.json({
      status: "success",
      message: "OTP send to your phone",
      sendOtp,
    });
  } catch (error) {
    next(error);
  }
};

const getCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const customer = req.user;

    const profile = await customerModel.findById(customer?._id);

    if (!profile) {
      return res.json({ message: "somthin went wrong in Profile customer" });
    }
    res.status(200).json({ profile });
  } catch (error) {
    next(error);
  }
};

const editCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const customer = req.user;
    const customerInputs = plainToClass(editCustomerProfileInput, req.body);
    const inputError = await validate(customerInputs, {
      validationError: { target: true },
    });
    if (inputError.length > 0) {
      return res.status(400).json({ inputError });
    }
    const { firstName, lastName, address } = customerInputs;
    const profile = await customerModel.findById(customer?._id);

    if (!profile) {
      return res.json({ message: "somthin went wrong in Profile customer" });
    }
    profile.firstName = firstName;
    profile.lastName = lastName;
    profile.address = address;
    const result = profile.save();

    res.json({
      message: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
//========================= Cart =============================
const addToCartCon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Identify the current logged-in user
    const customer = req.user;

    // Fetch the customer profile and populate cart items
    const profile = await customerModel
      .findById(customer?._id)
      .populate("cart.food");

    // If profile is not found, prompt user to login
    if (!profile) {
      return res.json({ message: "customer must login before create order" });
    }

    // Extract item ID and quantity from request body
    const { _id, quantity } = <cartItem>req.body;
    let cartItems: Array<{ food: any; quantity: number }> = [];

    // Check if the food item exists in the database
    const food = await foodModel.findById(_id);
    if (!food) {
      return res.json({ message: "this item is sold out" });
    }

    // Get the current cart items
    cartItems = profile.cart;

    // If there are items in the cart, check if the item already exists
    if (cartItems.length > 0) {
      const existFoodItems = cartItems.filter(
        (item) => item.food._id.toString() === _id
      );
      console.log({ existFoodItems });

      // Update quantity if the item exists, otherwise add it to the cart
      if (existFoodItems.length > 0) {
        const index = cartItems.indexOf(existFoodItems[0]);
        // console.log("index ",index);

        if (quantity > 0) {
          // update quantity
          const newQuantity = (cartItems[index].quantity += quantity);
          // console.log("dddddddddddd",newQuantity);
          cartItems[index] = { food, quantity: newQuantity };
        } else {
          // remove item from cart
          // console.log("herre",cartItems.splice(index, 1));
          cartItems.splice(index, 1);
        }
      } else {
        cartItems.push({ food, quantity });
      }
    } else {
      // Add new item to an empty cart
      cartItems.push({ food, quantity });
    }

    // Save the updated cart
    if (cartItems) {
      profile.cart = cartItems as any;
      const cartResult = await profile.save();
      return res
        .status(200)
        .json({ message: "item added to cart", data: cartResult });
    }
  } catch (error) {
    next(error);
  }
};

const getCartCon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Identify the current logged-in user
    const customer = req.user;

    // Fetch the customer profile and populate cart items
    const profile = await customerModel
      .findById(customer?._id)
      .populate("cart.food");

    // If profile is not found, prompt user to login
    if (!profile) {
      return res.status(400).json({ message: "cart customer is empty" });
    }
    return res.status(200).json({ message: "cart", data: profile });
  } catch (error) {
    next(error);
  }
};

const deleteCartCon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Identify the current logged-in user
    const customer = req.user;

    // Fetch the customer profile and populate cart items
    const profile = await customerModel
      .findById(customer?._id)
      .populate("cart.food");

    // If profile is not found, prompt user to login
    if (!profile) {
      return res
        .status(400)
        .json({ message: "cart customer is already empty" });
    }

    profile.cart = [] as any;
    const cartResult = await profile.save();

    return res.status(200).json({ message: "cart", data: cartResult });
  } catch (error) {
    next(error);
  }
};
//=========================Apply Offers =============================
const applayOfferCon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: offerId } = req.params;

    const offer = await offerModel.findById(offerId);
    if (!offer) {
      return res.status(400).json({ message: "offer is not valid" });
    }
    if (offer.promoType === "USER") {
      // only can applay once per user
    } else {
      if (offer.isActive) {
        res.status(200).json({ message: "offer is valid", deta: offer });
      }
    }
  } catch (error) {
    next(error);
  }
};
//========================= Payment =============================
const createPaymentCon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

    const { offerId, amount, paymentMode } = req.body;
    const customer = req.user;

    const offer = await offerModel.findById(offerId);
    if (!offer) {
      return res.status(400).json({ message: "offer is not valid" });
    }
    let totalAfterOffer = Number(amount);
    if (offer.isActive) {
      totalAfterOffer = totalAfterOffer - offer.offreAmount;
    }

    // Perform payment getaway Charge API call

    // success || failure response

    // Create record on Transaction
    const transactionData = {
      customer: customer._id,
      vendorId: "",
      orderId: "",
      orderTotalPrice: totalAfterOffer,
      offerUsed: offerId || "NA",
      status: "OPEN", // Failed || Success
      paymentMode,
      // paymentResponse: {},
    };

    // if (paymentMode === "CARD") {
    //   const { token } = req.body;
    //   try {
    //     const charge = await stripe.charges.create({
    //       amount: totalAfterOffer * 100, // Amount in cents
    //       currency: "EGP",
    //       source: token.id,
    //       receipt_email: customer.email,
    //       description: `Payment for order with offer ${offerId}`,
    //     });
    //     transactionData.status = "SUCCESS";
    //     transactionData.paymentResponse = charge;
    //   } catch (error) {
    //     transactionData.status = "SUCCESS";
    //     transactionData.paymentResponse = { error: error.message };
    //   }
    // } else {
    //   // For COD or other payment modes
    //   transactionData.paymentResponse = "Payment is Cash On Delivery";
    // }
    /**
     * why we dont use idempotencyKey >>  // Generate a unique idempotency key
  const idempotencyKey = uuidv4(); and  >> const { token } = authToken;
  const { card } = token;
     */
    const transaction = await transactionModel.create(transactionData);
    // return Transaction ID
    res.status(200).json({ transaction });

};

// const createPaymentCon = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { offerId, amount, paymentMode, authToken } = req.body;
//     const customer = req.user;

//     // Validate offer
//     const offer = await offerModel.findById(offerId);
//     if (!offer) {
//       return res.status(400).json({ message: "Offer is not valid" });
//     }

//     // Calculate total after applying offer
//     let totalAfterOffer = Number(amount);
//     if (offer.isActive) {
//       totalAfterOffer -= offer.offreAmount;
//     }

//     // Prepare transaction data
//     let transactionData = {
//       customer: customer._id,
//       vendorId: "",
//       orderId: "",
//       orderTotalPrice: totalAfterOffer,
//       offerUsed: offerId || "NA",
//       status: "OPEN", // Initial status
//       paymentMode,
//       paymentResponse: {},
//     };

//     if (paymentMode === "CARD") {
//       const { token } = authToken;
//       const paymentResult = await createStripePayment({
//         email: customer.email,
//         token,
//         amount: totalAfterOffer,
//         offerId,
//       });

//       transactionData.status = paymentResult.status;
//       transactionData.paymentResponse =
//         paymentResult.status === "SUCCESS"
//           ? paymentResult.charge
//           : { error: paymentResult.error };
//     } else {
//       // For non-CARD payment modes
//       transactionData.paymentResponse = "Payment is Cash On Delivery";
//     }

//     // Create transaction record in the database
//     const transaction = await transactionModel.create(transactionData);

//     // Send response
//     res.status(200).json({ transaction });
//   } catch (error) {
//     next(error);
//   }
// };
//========================= Delivery Notifications =============================

const assignOrderForDelivery = async (orderId: string, vendorId: string) => {
  // find vendor
  const vendor = await vendorModel.findById(vendorId);
  if (vendor) {
    const areaCode = vendor.pinCode;
    // const vendorLng = vendor.lng;
    // const vendorLat = vendor.lat;
    // find the avaliable delivery person

    const deliveryPerson = await deliveryModel.find({
      pinCode: areaCode,
      verified: true,
      isAvaliable: true,
    });

    if (deliveryPerson) {
      // check hte nearest delivery peson && asign the order
      console.log(`Delivery Person >> ${deliveryPerson[0]}`);
      
      const currentOrder = await orderModel.findById(orderId)
      if (currentOrder) {

        // update delivery id
        currentOrder.deliveryId = deliveryPerson[0]._id as string
        const response = await currentOrder.save()

        console.log("response>>",response);
        
        // Notify to vendor for received new order using firebase push notification
      }
    }
  }
};
//========================= Order =============================
const validateTransaction = async (tnxId: string) => {
  const currentTransaction = await transactionModel.findById(tnxId);
  if (currentTransaction) {
    if (currentTransaction.status.toLowerCase() !== "failed") {
      return { status: true, currentTransaction };
    }
  }
  return { status: false, currentTransaction };
};

const createOrderCon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // grab current login customer
    const customer = req.user;
    console.log("customer", customer);
    const { transactionId, amount, items } = <createOrderInput>req.body;

    // validate transaction
    const { status, currentTransaction } = await validateTransaction(
      transactionId
    );

    if (!status) {
      return res.status(404).json({ message: "Error while create order" });
    }

    const profile = await customerModel.findById(customer?._id);
    console.log("frrr", profile);

    if (!profile) {
      return res
        .status(404)
        .json({ message: "customer must login before create order" });
    }
    // create order id
    const orderId = `${Math.floor(Math.random() * 900000 + 1000)}`;

    const cartItems: Array<{ food: any; quantity: number }> = [];
    // calc order amount
    let price = 0.0;

    let vendorId;

    // match cart that in req with food in stock
    const foodsId = items.map((item) => item._id);
    // const foods = await foodModel
    //   .find()
    //   .where("_id")
    //   .in(foodsId )
    //   .exec();
    //OR
    const foods = await foodModel.find({ _id: { $in: foodsId } }).exec();
    // make price & cartItems
    foods.map((food) =>
      items.map(({ _id, quantity }) => {
        if (food._id == _id) {
          vendorId = food.vendorId;
          price += food.price * quantity;
          cartItems.push({ food, quantity });
        } else {
          console.log(`food>> ${food._id} === id>> ${_id} `);
        }
      })
    );
    // create order with item descriptions
    if (cartItems.length > 0) {
      console.log("cartItemssssssss ", cartItems);

      // create order
      const orderData = {
        orderId: orderId,
        vendorId: vendorId,
        items: cartItems,
        totalAmuont: price,
        paidAmuont: amount,
        orderDate: new Date(),
        orderStatus: "waiting",
        remarks: "",
        deliveryId: "",
        readyTime: 45,
      };
      const order = await orderModel.create(orderData);
      // update order to user account
      profile.cart = [] as any;
      profile.orders.push(order);

      currentTransaction.vendorId = vendorId;
      currentTransaction.orderId = orderId;
      currentTransaction.status = "CONFIRMED";
      await currentTransaction.save();

      assignOrderForDelivery(order._id as string, vendorId);

      const savedOrder = await profile.save();

      return res.status(200).json({ profile: savedOrder });
    }
    return res.status(400).json({ message: "Error happend in create order" });
  } catch (error) {
    next(error);
  }
};
const getAllOrdersCon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const customer = req.user;

    const profile = await customerModel
      .findById(customer?._id)
      .populate("orders");

    if (!profile) {
      return res.json({ message: "somthin went wrong in Profile customer" });
    }

    res.status(200).json({ profile: profile.orders });
  } catch (error) {
    next(error);
  }
};
const getOrderByIdCon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await orderModel.findById(id).populate("items.food");
    res.status(200).json({ profile: result });
  } catch (error) {
    next(error);
  }
};

export {
  customerSignUp,
  customerLogin,
  customerVerify,
  requestOtp,
  getCustomerProfile,
  editCustomerProfile,
  addToCartCon,
  getCartCon,
  deleteCartCon,
  applayOfferCon,
  createPaymentCon,
  createOrderCon,
  getOrderByIdCon,
  getAllOrdersCon,
};
