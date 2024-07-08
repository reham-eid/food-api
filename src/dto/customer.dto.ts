import {
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
class createOrderInput {
  @IsNotEmpty({ message: "itmet ID is required" })
  @IsString()
  _id: string;

  @IsNotEmpty({ message: "quantity is required" })
  @IsNumber()
  quantity: number;
}
// payload for token
interface customerPayload {
  _id: string;
  email: string;
  verfied: boolean;
}

export {
  createCustomerInput,
  loginCustomerInput,
  customerPayload,
  editCustomerProfileInput,
  createOrderInput
};
