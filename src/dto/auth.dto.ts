import { customerPayload } from "./customer.dto";
import { vendorPayload } from "./vendor.dto";

export type AuthPayload = vendorPayload  | customerPayload // | adminPayload