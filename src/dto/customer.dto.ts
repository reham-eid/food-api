import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from "class-validator";

class createCustomerInput {
  @IsNotEmpty({ message: "Phone is required" })
  @Length(10, 15, { message: "Phone must be between 10 and 15 digits" })
  phone: string;

  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Email must be a valid email address" })
  email: string;

  @IsNotEmpty({ message: "Password is required" })
  @MinLength(6, { message: "Password must be 6 characters or more" })
  password: string;
}
class loginCustomerInput {
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Email must be a valid email address" })
  email: string;

  @IsNotEmpty({ message: "Password is required" })
  @MinLength(6, { message: "Password must be 6 characters or more" })
  password: string;
}
class editCustomerProfileInput {
  @IsOptional()
  @MinLength(3, { message: "firstName must be 3 characters" })
  firstName: string;

  @IsOptional()
  @MinLength(3, { message: "lastName must be 3 characters" })
  lastName: string;

  @IsOptional()
  @Length(1, 6, { message: "address must be between 1 and 6 characters" })
  address: string;
}
class cartItem {
  @IsNotEmpty({ message: "itmet ID is required" })
  @IsString()
  _id: string;

  @IsNotEmpty({ message: "quantity is required" })
  @IsNumber()
  quantity: number;
}
class createOrderInput {
  @IsNotEmpty({ message: "transaction ID is required" })
  @IsString()
  transactionId: string;

  @IsNotEmpty({ message: "amount is required" })
  @IsNumber()
  amount: number; //orderTotalPrice

  @IsNotEmpty({ message: "itmets ID is required" })
  @IsArray()
  items: [cartItem];
}
// ======================delivery
class createDeliveryInput {
  @IsNotEmpty({ message: "Phone is required" })
  @Length(10, 15, { message: "Phone must be between 10 and 15 digits" })
  phone: string;

  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Email must be a valid email address" })
  email: string;

  @IsNotEmpty({ message: "Password is required" })
  @MinLength(6, { message: "Password must be 6 characters or more" })
  password: string;

  @IsNotEmpty({ message: "first name is required" })
  @IsString({ message: "first name must be string" })
  firstName: string;

  @IsNotEmpty({ message: "last name is required" })
  @IsString({ message: "last name must be string" })
  lastName: string;

  @IsNotEmpty({ message: "address is required" })
  @Length(2,5)
  address:string

  @IsNotEmpty({ message: "pin code is required" })
  @Length(2,10)
  pinCode:string
}

// payload for token
interface customerPayload {
  _id: string;
  email: string;
  verified: boolean;
}

export {
  createCustomerInput,
  loginCustomerInput,
  customerPayload,
  editCustomerProfileInput,
  cartItem,
  createOrderInput,
  createDeliveryInput
};
